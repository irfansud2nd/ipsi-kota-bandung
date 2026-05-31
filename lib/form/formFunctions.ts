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
    const { result, error } = await uploadFile(formData);

    if (error) throw error;

    return getPublicUrl(directory);
  } catch (error) {
    throw error;
  }
};

export const getPublicUrl = async (directory: string) => {
  return `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/ipsi-kota-bandung/${directory}`;
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

  let message: string = error;
  let code: string | undefined = undefined;

  if (typeof error != "string") {
    message = getNestedProperty(error, "message") ?? "Something went wrong";
    code = getNestedProperty(error, "code") ?? undefined;
  }

  let string = message;
  if (code) string += ` | ${code}`;

  toast.error(string, { id });
};
