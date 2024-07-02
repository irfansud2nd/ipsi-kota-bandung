import axios from "axios";
import { imageMaxSize, imageSchema } from "./formConstants";
import { toast } from "sonner";
import { uploadFile } from "../actions";

export const sendFile = async (file: File, directory: string) => {
  if (!imageSchema(Math.max(...Object.values(imageMaxSize))).isValidSync(file))
    throw new Error("invalid File");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);
  try {
    const { result: downloadUrl, error } = await uploadFile(formData);

    if (error) throw error;

    return downloadUrl;
  } catch (error) {
    throw error;
  }
};

export const toastError = (error: any, id?: string | number) => {
  const getNestedProperty = (obj: any, property: string): any => {
    if (obj == null) return undefined;

    if (obj.hasOwnProperty(property)) {
      return obj[property];
    }

    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        const result = getNestedProperty(obj[key], property);
        if (result !== undefined) {
          return result;
        }
      }
    }

    return undefined;
  };
  const message = getNestedProperty(error, "message") ?? "Something went wrong";
  const code = getNestedProperty(error, "code") ?? undefined;

  // console.log({ error });
  // console.log({ message });
  // console.log({ code });
  let string = message;
  if (code) string += ` | ${code}`;

  toast.error(string, { id });
};

export const testFunc = async () => {
  try {
    console.log("hitting /api/test/1");
    await axios.get("/api/test/1");
    console.log("hitting /api/test/2");
    await axios.get("/api/test/2");
    console.log("hitting /api/test/3");
    await axios.get("/api/test/3");
  } catch (error: any) {
    toastError(error);
    throw error;
  }
};
