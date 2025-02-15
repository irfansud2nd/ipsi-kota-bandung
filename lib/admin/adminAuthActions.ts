"use server";

import { cookies } from "next/headers";
import { adminCookieName, createAdminSession } from "./adminSession";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { SpecialUserSql } from "./adminConstants";
import supabase from "../database/supabase";

export const deleteAdminSession = async () => {
  cookies().delete(adminCookieName);
};

export const fetchUserRoles = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  console.log("FETCH SPECIAL USER");
  const { data, error } = await supabase
    .from("special_users")
    .select()
    .eq("email", session.user?.email)
    .returns<SpecialUserSql[]>();

  if (error) {
    console.error(error);
    return false;
  }

  if (!data.length) return false;

  const { name, roles, image } = data[0];

  await createAdminSession(name, roles, image);
  return true;
};
