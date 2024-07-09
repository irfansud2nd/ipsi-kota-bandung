"use server";
import { apiProtect } from "../admin/adminActions";
import { ServerAction } from "../constants";
import supabase from "../database/supabase";
import { action } from "../functions";
import { OfficialSql } from "./officialContants";

// OFFICIAL SQL
// READ
export const getOfficialsSql = async (
  page: number,
  limit: number,
  showAll: boolean = false
): Promise<ServerAction<OfficialSql[]>> => {
  try {
    const response = await apiProtect({ directory: "official" });
    if (response) throw new Error(response.message);

    let getData = supabase.from("officials").select().returns<OfficialSql[]>();

    if (!showAll)
      getData = getData.range(page * limit - limit, page * limit - 1);

    const { data, error } = await getData;

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const getOfficialsSqlByContingentId = async (
  contingentId: string
): Promise<ServerAction<OfficialSql[]>> => {
  try {
    const response = await apiProtect();
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .from("officials")
      .select()
      .eq("contingent_id", contingentId)
      .returns<OfficialSql[]>();

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

// CREATE
export const addOfficialSql = async (
  officialSql: OfficialSql
): Promise<ServerAction<OfficialSql>> => {
  try {
    const response = await apiProtect();
    if (response) throw new Error(response.message);

    const { error } = await supabase.from("officials").insert(officialSql);

    if (error) throw new Error(error.message);

    return action.success(officialSql);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updateOfficialSql = async (
  officialSql: OfficialSql
): Promise<ServerAction<OfficialSql>> => {
  try {
    const response = await apiProtect();
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("officials")
      .update(officialSql)
      .eq("id", officialSql.id);

    if (error) throw new Error(error.message);

    return action.success(officialSql);
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteOfficialSql = async (
  officialSql: OfficialSql
): Promise<ServerAction<OfficialSql>> => {
  try {
    const response = await apiProtect();
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("officials")
      .delete()
      .eq("id", officialSql.id);

    if (error) throw new Error(error.message);

    return action.success(officialSql);
  } catch (error) {
    return action.error(error);
  }
};

// OTHERS
export const countOfficial = async (): Promise<ServerAction<number>> => {
  try {
    const { count, error } = await supabase
      .from("officials")
      .select("id", { count: "exact", head: true });

    if (error) throw new Error(error.message);

    return action.success(count || 0);
  } catch (error) {
    return action.error(error);
  }
};

export const getOfficialIdsByContingentId = async (
  contingentId: string
): Promise<ServerAction<string[]>> => {
  try {
    const response = await apiProtect({ directory: "official" });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .from("officials")
      .select("id")
      .eq("contingent_id", contingentId);

    if (error) throw new Error(error.message);

    return action.success(data.map((item) => item.id as string));
  } catch (error) {
    return action.error(error);
  }
};
