"use server";

import { cache } from "react";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { Event, EventSql } from "./eventConstants";
import { ServerAction } from "../constants";
import { action } from "../functions";

// EVENT SQL
// CREATE
export const addEventSql = async (
  eventSql: EventSql
): Promise<ServerAction<EventSql>> => {
  try {
    const response = await apiProtect({ directory: "event" });
    if (response) throw new Error(response.message);

    const { error } = await supabase.from("events").insert(eventSql);
    if (error) throw new Error(error.message);

    return action.success(eventSql);
  } catch (error) {
    return action.error(error);
  }
};

// READ
export const getEventSql = cache(
  async (id: string): Promise<ServerAction<EventSql>> => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select()
        .eq("id", id)
        .returns<EventSql[]>();

      if (error) throw new Error(error.message);

      const eventSql = data[0];

      return action.success(eventSql);
    } catch (error) {
      return action.error(error);
    }
  }
);

//UPDATE
export const updateEventSql = async (
  eventSql: EventSql
): Promise<ServerAction<EventSql>> => {
  try {
    const response = await apiProtect({ directory: "event" });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("events")
      .update(eventSql)
      .eq("id", eventSql.id);

    if (error) throw new Error(error.message);

    return action.success(eventSql);
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteEventSql = async (
  eventSql: EventSql
): Promise<ServerAction<EventSql>> => {
  try {
    const response = await apiProtect({ directory: "event" });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventSql.id);

    if (error) throw new Error(error.message);

    return action.success(eventSql);
  } catch (error) {
    return action.error(error);
  }
};

// EVENTS SQL
// READ
export const getEventsSql = cache(
  async (
    page?: number,
    limit?: number,
    exception?: Event
  ): Promise<ServerAction<EventSql[]>> => {
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

      const { data, error } = await getData.returns<EventSql[]>();

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);
