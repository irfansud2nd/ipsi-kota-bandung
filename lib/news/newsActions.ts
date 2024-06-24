"use server";

import { cache } from "react";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { News, NewsSql } from "./newsConstants";
import { newsSqlToNews, newsToNewsSql } from "./newsFunctions";

// NEWS SQL
// CREATE
export const addNewsSql = async (newsSql: NewsSql) => {
  try {
    const response = await apiProtect({ directory: "news" });
    if (response) throw response;

    const { error } = await supabase.from("news").insert(newsSql);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateNewsSql = async (newsSql: NewsSql) => {
  try {
    const response = await apiProtect({ directory: "news" });
    if (response) throw response;

    const { error } = await supabase
      .from("news")
      .update(newsSql)
      .eq("id", newsSql.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// DELETE
export const deleteNewsSql = async (newsSql: NewsSql) => {
  try {
    const response = await apiProtect({ directory: "news" });
    if (response) throw response;

    const { error } = await supabase.from("news").delete().eq("id", newsSql.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// NEWS
// READ
export const getNews = cache(async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("news")
      .select()
      .eq("id", id)
      .returns<NewsSql[]>();

    if (error) throw new Error(error.message);

    const news = newsSqlToNews(data[0]);
    return news;
  } catch (error) {
    throw error;
  }
});

// NEWS ARR
// READ
export const getNewsArr = cache(
  async (page?: number, limit?: number, exception?: News) => {
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

      const news = data.map((item) => newsSqlToNews(item));

      return news;
    } catch (error) {
      throw error;
    }
  }
);
