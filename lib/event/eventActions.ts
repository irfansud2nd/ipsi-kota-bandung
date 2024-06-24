"use server";

import { cache } from "react";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { Championship, Event, EventSql } from "./eventConstants";

// EVENT SQL
// CREATE
export const addEventSql = async (eventSql: EventSql) => {
  try {
    const response = await apiProtect({ directory: "event" });
    if (response) throw response;

    const { error } = await supabase.from("events").insert(event);
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

//UPDATE
export const updateEventSql = async (eventSql: EventSql) => {
  try {
    const response = await apiProtect({ directory: "event" });
    if (response) throw response;

    const { error } = await supabase
      .from("events")
      .update(eventSql)
      .eq("id", eventSql.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// DELETE
export const deleteEventSql = async (eventSql: EventSql) => {
  try {
    const response = await apiProtect({ directory: "event" });
    if (response) throw response;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventSql.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// EVENT
// READ
export const getEvent = cache(async (id: string) => {
  try {
    const { data, error } = await supabase.from("events").select().eq("id", id);

    if (error) throw new Error(error.message);
    return data[0] as Event | Championship;
  } catch (error) {
    throw error;
  }
});

export const getEvents = cache(
  async (page?: number, limit?: number, exception?: Event | Championship) => {
    try {
      let getData = supabase
        .from("events")
        .select()
        .order("created_at", { ascending: false });

      if (page && limit)
        getData = getData.range(page * limit - limit, page * limit - 1);

      if (exception) {
        getData = getData.neq("id", exception.id);
      }

      const { data, error } = await getData;

      if (error) throw new Error(error.message);
      return data as (Event | Championship)[];
    } catch (error) {
      throw error;
    }
  }
);
