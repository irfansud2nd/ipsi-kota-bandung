"use server";
import { NextResponse } from "next/server";
import supabase from "../database/supabase";
import { SpecialUser, SpecialUserRole } from "./adminConstants";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { getPermittedRoles, isPermitted } from "./adminFunctions";
import { decode, sign } from "jsonwebtoken";

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
    console.log("CHECK TOKEN");
    const authorizedToken = session?.user?.authorizedToken;
    if (authorizedToken) {
      const data: any = decode(authorizedToken);
      result = data;
      options?.roles &&
        (result.permitted = isPermitted(data.roles, options.roles));
      return result;
    }
  }

  console.log("FETCH SPECIAL USERS");
  const { data } = await supabase
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

  if (options?.permittedEmail && userEmail == options.permittedEmail)
    return initialResult;
  if (!roles.length) return initialResult;

  !roles.includes("master") && roles.push("master");

  const { permitted } = await isAuthorized({ roles });
  if (permitted) return initialResult;

  result.message = "Not authorized";
  result.response = NextResponse.json(
    { message: result.message, code: "not-authotrized" },
    { status: 403 }
  );

  return result;
};
