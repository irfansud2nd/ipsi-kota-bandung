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

// DELETE FILE
export const deleteFile = async (
  directory: string
): Promise<ServerAction<string>> => {
  try {
    if (!directory) throw new Error("Invalid identifier");

    const acessedByGuest = ["athlete", "official"];
    let params: any = { directory };

    if (acessedByGuest.some((item) => directory.split("/").includes(item)))
      params = { loggedInOnly: true };

    const response = await apiProtect(params);
    if (response) throw new Error(response.message);

    await deleteObject(ref(storage, directory));

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
      params = { loggedInOnly: true };

    const response = await apiProtect(params);
    if (response) throw new Error(response.message);

    if (
      !imageSchema(Math.max(...Object.values(imageMaxSize))).isValidSync(file)
    )
      throw new Error("Invalid file");

    const snapshot = await uploadBytes(ref(storage, directory), file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return action.success(downloadUrl);
  } catch (error) {
    return action.error(error);
  }
};

export const deleteFiles = async (
  directories: string[]
): Promise<ServerAction<string>> => {
  try {
    if (directories.length) {
      const deletePromises = directories.map(async (directory) => {
        const { error } = await deleteFile(directory);
        if (error) throw error;
      });

      await Promise.all(deletePromises);
    }
    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};
