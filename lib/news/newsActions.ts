"use server";

import { cache } from "react";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { News, NewsSql } from "./newsConstants";
import { ServerAction } from "../constants";
import { action } from "../functions";

// NEWS SQL
// CREATE
export const addNewsSql = async (
  newsSql: NewsSql
): Promise<ServerAction<NewsSql>> => {
  try {
    const response = await apiProtect({ directory: "news" });
    if (response) throw response;

    const { error } = await supabase.from("news").insert(newsSql);

    if (error) throw new Error(error.message);

    return action.success(newsSql);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updateNewsSql = async (
  newsSql: NewsSql
): Promise<ServerAction<NewsSql>> => {
  try {
    const response = await apiProtect({ directory: "news" });
    if (response) throw response;

    const { error } = await supabase
      .from("news")
      .update(newsSql)
      .eq("id", newsSql.id);

    if (error) throw new Error(error.message);

    return action.success(newsSql);
  } catch (error) {
    return action.error(error);
  }
};

// READ
export const getNewsSql = cache(
  async (id: string): Promise<ServerAction<NewsSql | undefined>> => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select()
        .eq("id", id)
        .returns<NewsSql[]>();

      if (error) throw new Error(error.message);

      return action.success(data[0]);
    } catch (error) {
      return action.error(error);
    }
  }
);

// DELETE
export const deleteNewsSql = async (
  newsSql: NewsSql
): Promise<ServerAction<NewsSql>> => {
  try {
    const response = await apiProtect({ directory: "news" });
    if (response) throw response;

    const { error } = await supabase.from("news").delete().eq("id", newsSql.id);

    if (error) throw new Error(error.message);

    return action.success(newsSql);
  } catch (error) {
    return action.error(error);
  }
};

// NEWS ARR SQL
// READ
export const getNewsArrSql = cache(
  async (
    page?: number,
    limit?: number,
    exception?: News
  ): Promise<ServerAction<NewsSql[]>> => {
    try {
      let getData = supabase
        .from("news")
        .select()
        .order("created_at", { ascending: false });

      if (page && limit)
        getData = getData.range(page * limit - limit, page * limit - 1);

      if (exception) {
        getData = getData.neq("id", exception.id);
      }

      const { data, error } = await getData.returns<NewsSql[]>();

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);
