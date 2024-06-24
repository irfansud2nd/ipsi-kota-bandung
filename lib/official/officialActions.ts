"use server";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { OfficialSql } from "./officialContants";
import { officialSqlToOfficial } from "./officialFunctions";

// OFFICIAL SQL
// READ
export const getOfficialsSqlByEmail = async (email: string) => {
  try {
    const { message } = await apiProtect({ permittedEmail: email });
    if (message) throw new Error(message);

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

export const getOfficialsSql = async (
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const { message } = await apiProtect({ directory: "official" });
    if (message) throw new Error(message);

    let getData = supabase.from("officials").select().returns<OfficialSql[]>();

    if (!showAll)
      getData = getData.range(page * limit - limit, page * limit - 1);

    const { data, error } = await getData;

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

// CREATE
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

// UPDATE
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

// DELETE
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

// OFFICIAL
// READ
export const getOfficials = async (
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const { message } = await apiProtect({ directory: "official" });
    if (message) throw new Error(message);

    const officialsSql = await getOfficialsSql(page, limit, showAll);
    const officials = officialsSql.map((officialSql) =>
      officialSqlToOfficial(officialSql)
    );

    return officials;
  } catch (error) {
    throw error;
  }
};

export const countOfficial = async () => {
  try {
    const { count, error } = await supabase
      .from("officials")
      .select("id", { count: "exact", head: true });

    if (error) throw error;

    return count || 0;
  } catch (error) {
    throw error;
  }
};

// OTHERS
export const countOfficialByContingentId = async (contingentId: string) => {
  try {
    const { count, error } = await supabase
      .from("officials")
      .select("id", { count: "exact", head: true })
      .eq("contingent_id", contingentId);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    throw error;
  }
};
