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
import { Championship, Event } from "./event/eventConstants";
import { News } from "./news/newsConstants";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./database/firebase";
import { imageMaxSize, imageSchema } from "./form/formConstants";

// DELETE FILE
export const deleteFile = async (directory: string) => {
  try {
    if (!directory) throw { message: "Invalid identifier" };

    const acessedByGuest = ["athlete", "official"];
    let params: any = { directory };

    if (acessedByGuest.some((item) => directory.split("/").includes(item)))
      params = { loggedInOnly: true };

    const response = await apiProtect(params);
    if (response) throw response;

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

    const response = await apiProtect(params);
    if (response) throw response;

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
