"use server";

import { cache } from "react";
import {
  AttendanceReport,
  InternalAthleteRole,
  internalAthleteRoles,
} from "./athlete/internal/internalAthleteConstants";
import { apiProtect } from "./admin/adminActions";
import supabase from "./database/supabase";
import { Announcement } from "./announcement/announcementConstants";
import { Championship, Event, championships } from "./event/eventConstants";
import { News } from "./news/newsConstants";
import { Member } from "./member/memberConstants";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./database/firebase";
import { imageMaxSize, imageSchema } from "./form/formConstants";
import { SpecialUserRole } from "./admin/adminConstants";

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
  async (page?: number, limit?: number, exception?: News) => {
    try {
      let getData = supabase
        .from("news")
        .select()
        .order("createdAt", { ascending: false });

      if (page && limit)
        getData = getData.range(page * limit - limit, page * limit - 1);

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

// DELETE FILE
export const deleteFile = async (directory: string) => {
  try {
    if (!directory) throw { message: "Invalid identifier" };

    const acessedByGuest = ["athlete", "official"];
    let params: any = { directory };

    if (acessedByGuest.some((item) => directory.split("/").includes(item)))
      params = { loggedInOnly: true };

    const { message } = await apiProtect(params);
    if (message) throw { message };

    await deleteObject(ref(storage, directory));
  } catch (error) {
    throw error;
  }
};

// SEND FILE
export const uploadFile = async (formData: FormData) => {
  try {
    const file = formData.get("file") as File;
    const directory = formData.get("directory") as string;

    if (!file || !directory) throw { message: "Invalid identifier" };

    const acessedByGuest = ["athlete", "payment", "official"];
    let params: any = { directory };

    if (acessedByGuest.some((item) => directory.split("/").includes(item)))
      params = { loggedInOnly: true };

    const { message } = await apiProtect(params);
    if (message) throw { message };

    if (
      !imageSchema(Math.max(...Object.values(imageMaxSize))).isValidSync(file)
    )
      throw { message: "Invalid file" };

    const snapshot = await uploadBytes(ref(storage, directory), file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
  } catch (error) {
    throw error;
  }
};

export const deleteFiles = async (directories: string[]) => {
  try {
    if (!directories.length) return;

    const deletePromises = directories.map((directory) =>
      deleteFile(directory)
    );

    await Promise.all(deletePromises);
  } catch (error) {
    throw error;
  }
};
