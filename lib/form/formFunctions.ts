import axios from "axios";
import { imageMaxSize, imageSchema } from "./formConstants";
import { toast } from "sonner";

export const sendFile = async (file: File, directory: string) => {
  const axiosFileConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  if (!imageSchema(Math.max(...Object.values(imageMaxSize))).isValidSync(file))
    throw new Error("invalid File");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);
  return axios
    .post("/api/file", formData, axiosFileConfig)
    .then((res) => {
      return res.data.downloadUrl;
    })
    .catch((error) => {
      throw error;
    });
};

export const toastError = (error: any, id?: string | number) => {
  const message = error.response?.data
    ? error.response.data.message
    : error.message ?? error ?? "Something went wrong";
  const code = error.response?.data
    ? error.response.data.code
    : error.code ?? "unkonwn-code";

  toast.error(`${message} | ${code || "no-code"}`, { id });
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
