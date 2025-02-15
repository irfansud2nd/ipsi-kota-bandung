"use server";
import supabase from "../database/supabase";
import {
  SpecialUser,
  SpecialUserRole,
  SpecialUserSql,
  adminLinks,
  hideAdminLinksFrom,
} from "./adminConstants";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { getPermittedRoles, isPermitted } from "./adminFunctions";
import { decode, sign } from "jsonwebtoken";
import { GroupedLinks, Links, ServerAction } from "../constants";
import { cache } from "react";
import { action } from "../functions";
import { getAdminServerSession } from "./adminSession";

// SPECIAL  USER
// CREATE
export const addSpecialUserSql = async (
  specialUserSql: SpecialUserSql
): Promise<ServerAction<SpecialUserSql>> => {
  try {
    const response = await apiProtect({
      roles: permittedRoles(specialUserSql.roles),
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("special_users")
      .upsert(specialUserSql);

    if (error) throw new Error(error.message);

    return action.success(specialUserSql);
  } catch (error) {
    return action.error(error);
  }
};

// READ
export const getSpecialUserSqlByEmail = async (
  email: string
): Promise<ServerAction<SpecialUserSql | undefined>> => {
  try {
    const { data, error } = await supabase
      .from("special_users")
      .select()
      .eq("email", email)
      .returns<SpecialUserSql[]>();

    if (error) throw new Error(error.message);

    if (!data.length) return action.success(undefined);

    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

export const getSpecialUsersSql = cache(
  async (
    role: SpecialUserRole,
    page: number,
    limit: number,
    forClient: boolean = false
  ): Promise<ServerAction<SpecialUserSql[]>> => {
    try {
      if (!forClient) {
        const response = await apiProtect({ directory: `admin/${role}` });
        if (response) throw new Error(response.message);
      }

      const query = forClient ? "name, image" : "*";

      const { data, error } = await supabase
        .from("special_users")
        .select(query)
        .order("name")
        .range(page * limit - limit, page * limit - 1)
        .contains("roles", [role])
        .returns<SpecialUserSql[]>();

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);

// UPDATE
export const updateSpecialUserSql = async (
  specialUserSql: SpecialUserSql
): Promise<ServerAction<SpecialUserSql>> => {
  try {
    // const response = await apiProtect({
    //   roles: permittedRoles(specialUserSql.roles),
    // });
    //  if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("special_users")
      .update(specialUserSql)
      .eq("email", specialUserSql.email);

    if (error) throw new Error(error.message);

    return action.success(specialUserSql);
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteSpecialUserSql = async (
  specialUserSql: SpecialUserSql
): Promise<ServerAction<SpecialUserSql>> => {
  try {
    const response = await apiProtect({
      roles: permittedRoles(specialUserSql.roles),
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("special_users")
      .delete()
      .eq("email", specialUserSql.email)
      .contains("roles", specialUserSql.roles);

    if (error) throw new Error(error.message);

    return action.success(specialUserSql);
  } catch (error) {
    return action.error(error);
  }
};

// OTHERS

export const apiProtect = async (options?: {
  directory?: string;
  roles?: SpecialUserRole[];
  permittedEmail?: string;
  throwError?: boolean;
}) => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  let roles = options?.roles || [];

  const initialResult:
    | {
        message: string;
        code: string;
        status: number;
      }
    | undefined = undefined;

  const notAuthorized = {
    message: "Not authorized",
    code: "not-authorized",
    status: 403,
  };

  if (options?.directory)
    roles = roles.concat(getPermittedRoles(options.directory));

  if (!userEmail) {
    return {
      message: "Not logged in",
      code: "not-authenticated",
      status: 401,
    };
  }

  if (!options) return initialResult;

  if (options?.permittedEmail && userEmail == options.permittedEmail)
    return initialResult;

  !roles.includes("master") && roles.push("master");

  const adminSession = await getAdminServerSession();
  if (!adminSession) return notAuthorized;

  const permitted = adminSession.roles.some((role) => roles.includes(role));

  if (permitted) return initialResult;

  return notAuthorized;
};

const permittedRoles = (roleToEdit: SpecialUserRole[]) => {
  let roles: SpecialUserRole[] = ["master"];
  if (roleToEdit.find((item) => item.includes("athlete"))) roles.push("coach");
  return roles;
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
  const adminSession = await getAdminServerSession();
  if (!session || !adminSession) return result;

  const { links, groupedLinks } = adminLinks;
  const { roles } = adminSession;

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
