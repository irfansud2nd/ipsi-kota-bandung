"use server";
import { apiProtect } from "./admin/adminActions";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./database/firebase";
import { imageMaxSize, imageSchema } from "./form/formConstants";
import { ServerAction } from "./constants";
import { action } from "./functions";
import supabase from "./database/supabase";

// DELETE FILE
export const deleteFile = async (
  directory: string
): Promise<ServerAction<string>> => {
  try {
    if (!directory) throw new Error("Invalid identifier");

    const acessedByGuest = ["athlete", "official"];
    let params: any = { directory };

    if (acessedByGuest.some((item) => directory.split("/").includes(item)))
      params = undefined;

    const response = await apiProtect(params);
    if (response) throw new Error(response.message);

    const { data, error } = await supabase.storage
      .from("ipsi-kota-bandung")
      .remove([directory]);

    if (error) throw error.message;

    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};

// SEND FILE
export const uploadFile = async (
  formData: FormData
): Promise<ServerAction<string>> => {
  try {
    const file = formData.get("file") as File;
    const directory = formData.get("directory") as string;

    if (!file || !directory) throw new Error("Invalid identifier");

    const acessedByGuest = ["athlete", "payment", "official"];
    let params: any = { directory };

    if (acessedByGuest.some((item) => directory.split("/").includes(item)))
      params = undefined;

    const response = await apiProtect(params);
    if (response) throw new Error(response.message);

    if (
      !imageSchema(Math.max(...Object.values(imageMaxSize))).isValidSync(file)
    )
      throw new Error("Invalid file");

    const { data, error } = await supabase.storage
      .from("ipsi-kota-bandung")
      .upload(directory, file, { upsert: true });

    if (error) throw error.message;

    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};

export const deleteFiles = async (
  directories: string[]
): Promise<ServerAction<string>> => {
  try {
    if (directories.length) {
      const { data, error } = await supabase.storage
        .from("ipsi-kota-bandung")
        .remove(directories);

      if (error) throw error.message;
    }

    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};
