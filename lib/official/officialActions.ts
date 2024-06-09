"use server";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { OfficialSql } from "./officialContants";

// OFFICIAL SQL
export const getOfficialsSqlByEmail = async (email: string) => {
  try {
    const { message } = await apiProtect({ permittedEmail: email });
    if (message) throw { message };

    const { data, error } = await supabase
      .from("officials")
      .select()
      .eq("created_by", email)
      .returns<OfficialSql[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

export const addOfficialSql = async (officialSql: OfficialSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: officialSql.created_by,
    });
    if (message) throw new Error(message);

    const { error } = await supabase.from("officials").insert(officialSql);

    if (error) throw error;

    return officialSql;
  } catch (error) {
    throw error;
  }
};

export const updateOfficialSql = async (officialSql: OfficialSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: officialSql.created_by,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("officials")
      .update(officialSql)
      .eq("id", officialSql.id);

    if (error) throw error;

    return officialSql;
  } catch (error) {
    throw error;
  }
};

export const deleteOfficialSql = async (officialSql: OfficialSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: officialSql.created_by,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("officials")
      .delete()
      .eq("id", officialSql.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
