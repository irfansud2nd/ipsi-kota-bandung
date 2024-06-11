"use server";
import { NextResponse } from "next/server";
import supabase from "../database/supabase";
import {
  SpecialUser,
  SpecialUserRole,
  adminLinks,
  hideAdminLinksFrom,
} from "./adminConstants";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { getPermittedRoles, isPermitted } from "./adminFunctions";
import { decode, sign } from "jsonwebtoken";
import { GroupedLinks, Links } from "../constants";

export const getSpecialUsers = async (
  role: SpecialUserRole,
  page: number,
  limit: number,
  forClient: boolean = false
) => {
  try {
    if (!forClient) {
      const { message } = await apiProtect({ directory: `admin/${role}` });
      if (message) throw new Error(message);
    }

    const query = forClient ? "name, image" : "*";

    const { data, error } = await supabase
      .from("specialUsers")
      .select(query)
      .order("name")
      .range(page * limit - limit, page * limit - 1)
      .contains("roles", [role]);

    if (error) throw new Error(error.message);
    const result: any = data;
    return result as SpecialUser[];
  } catch (error) {
    throw error;
  }
};

export const isAuthorized = async (options?: {
  ignoreJwt?: boolean;
  roles?: SpecialUserRole[];
  noFetch?: boolean;
}) => {
  type Result = {
    roles: SpecialUserRole[];
    token: string;
    permitted: boolean;
    name?: string;
    image?: { downloadUrl: string };
  };

  let result: Result = {
    roles: [],
    token: "",
    permitted: false,
  };

  const session: any = await getServerSession(authOptions);
  if (!session) return result;

  if (!options?.ignoreJwt) {
    // console.log("CHECK TOKEN");
    const authorizedToken = session?.user?.authorizedToken;
    if (authorizedToken) {
      const data: any = decode(authorizedToken);
      result = data;
      options?.roles &&
        (result.permitted = isPermitted(data.roles, options.roles));
      return result;
    }
  }

  if (options?.noFetch) return result;

  // console.log("FETCH SPECIAL USERS");
  const { data, error } = await supabase
    .from("specialUsers")
    .select()
    .eq("email", session?.user?.email);

  if (!data?.length) return result;

  result.roles = data?.[0]?.roles;
  result.name = data?.[0]?.name;
  result.image = data?.[0]?.image;

  const JWT_SECRET = process.env.JWT_SECRET as string;
  const jwt = sign(result, JWT_SECRET);
  result.token = jwt;
  options?.roles &&
    (result.permitted = isPermitted(data?.[0].roles, options.roles));

  return result;
};

// API PROTECT
export const apiProtect = async (options?: {
  loggedInOnly?: boolean;
  directory?: string;
  roles?: SpecialUserRole[];
  permittedEmail?: string;
  throwError?: boolean;
}) => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  let roles = options?.roles || [];

  const initialResult: {
    message?: string;
    response?: NextResponse<any>;
  } = {
    message: undefined,
    response: undefined,
  };
  let result = initialResult;

  if (!roles.length && options?.directory) roles = getPermittedRoles("roles");

  if (!userEmail) {
    result.message = "Not logged in";
    result.response = NextResponse.json(
      { message: result.message, code: "not-authenticated" },
      { status: 401 }
    );

    return result;
  }

  if (options?.loggedInOnly) return initialResult;

  if (options?.permittedEmail && userEmail == options.permittedEmail)
    return initialResult;

  if (!roles.length) return initialResult;

  !roles.includes("master") && roles.push("master");

  const { permitted } = await isAuthorized({ roles });
  if (permitted) return initialResult;

  result.message = "Not authorized";
  result.response = NextResponse.json(
    { message: result.message, code: "not-authorized" },
    { status: 403 }
  );

  return result;
};

export const getAdminLinks = async () => {
  let result: {
    links: Links;
    groupedLinks: GroupedLinks;
  } = {
    links: [],
    groupedLinks: [],
  };

  const session = await getServerSession(authOptions);
  if (!session) return result;

  const { links, groupedLinks } = adminLinks;
  const { roles } = await isAuthorized({ noFetch: true });

  result.links = links.filter(
    (link) =>
      !link.restricted || isPermitted(roles, getPermittedRoles(link.href))
  );
  result.groupedLinks = groupedLinks.filter((item) =>
    isPermitted(roles, getPermittedRoles(item.prefix))
  );

  if (hideAdminLinksFrom.length) {
    const hideLinks = hideAdminLinksFrom.find(
      (item) => item.email == session.user?.email
    );
    if (!hideLinks) return result;
    result.links = result.links.filter(
      (item) => !hideLinks.menu.includes(item.label)
    );
    result.groupedLinks = result.groupedLinks.filter(
      (item) => !hideLinks.menu.includes(item.title)
    );
  }

  return result;
};
