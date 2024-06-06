"use server";

import { cache } from "react";
import {
  AttendanceReport,
  InternalAthleteRole,
} from "./athlete/internal/internalAthleteConstants";
import { apiProtect } from "./admin/adminActions";
import supabase from "./database/supabase";
import { Announcement } from "./announcement/announcementConstants";
import { Championship, Event, championships } from "./event/eventConstants";
import { News } from "./news/newsConstants";
import { Member } from "./member/memberConstants";

export const getAttendances = cache(
  async (role: InternalAthleteRole, month: string) => {
    let start = new Date(month);
    start.setDate(1);
    start.setHours(0, 0, 1);
    let end = new Date(month);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59);

    try {
      const { message } = await apiProtect({
        directory: `admin/${role}`,
        throwError: true,
      });
      if (message) throw new Error(message);

      const { data, error } = await supabase
        .from("specialUsers")
        .select("email, name, attendances(id,date,type)")
        .contains("roles", [role])
        .gte("attendances.date", start.getTime())
        .lte("attendances.date", end.getTime())
        .eq("attendances.role", role);

      if (error) throw new Error(error.message);
      return data as AttendanceReport[];
    } catch (error) {
      throw error;
    }
  }
);

export const getAnnouncement = async () => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select()
      .limit(1);
    if (error) throw new Error(error.message);

    return data[0] as Announcement;
  } catch (error) {
    throw error;
  }
};

// GET EVENT
export const getEvent = cache(async (id: string) => {
  try {
    // const cEvent = championships.find((item) => item.id == id);
    // if (cEvent) return cEvent;

    const { data, error } = await supabase.from("events").select().eq("id", id);

    if (error) throw new Error(error.message);
    return data[0] as Event | Championship;
  } catch (error) {
    throw error;
  }
});

// GET EVENTS
export const getEvents = cache(
  async (page?: number, limit?: number, exception?: Event | Championship) => {
    try {
      let getData = supabase
        .from("events")
        .select()
        .order("createdAt", { ascending: false });

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

// GET BERITA
export const getNews = cache(async (id: string) => {
  try {
    const { data, error } = await supabase.from("news").select().eq("id", id);

    if (error) throw new Error(error.message);
    return data[0] as News;
  } catch (error) {
    throw error;
  }
});

// GET BERITAS
export const getNewsArr = cache(
  async (page: number, limit: number, exception?: News) => {
    try {
      let getData = supabase
        .from("news")
        .select()
        .order("createdAt", { ascending: false })
        .range(page * limit - limit, page * limit - 1);

      if (exception) {
        getData = getData.neq("id", exception.id);
      }

      const { data, error } = await getData;

      if (error) throw new Error(error.message);

      return data as News[];
    } catch (error) {
      throw error;
    }
  }
);

// GET EMPLOYEES
export const getEmployees = cache(async (page: number, limit: number) => {
  try {
    let getData = supabase
      .from("employees")
      .select()
      .order("order")
      .range(page * limit - limit, page * limit - 1);

    const { data, error } = await getData;

    if (error) throw new Error(error.message);

    return data as Member[];
  } catch (error) {
    throw error;
  }
});
