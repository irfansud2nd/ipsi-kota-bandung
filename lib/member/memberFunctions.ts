import { toast } from "sonner";
import { Member } from "./memberConstants";
import { v4 } from "uuid";
import axios from "axios";
import { sendFile, toastError } from "../form/formFunctions";

export const sendMember = async (member: Member) => {
  const toastId = toast.loading("Menambahkan pengurus");
  try {
    let data: Member = member;
    data.id = v4();

    if (data.image?.file) {
      toast.loading("Mengunggah gambar", { id: toastId });
      data.image.downloadUrl = await sendFile(
        data.image.file,
        `event/${data.id}`
      );
      delete data.image.file;
    }

    toast.loading("Mengunggah pengurus", { id: toastId });
    await axios.post("/api/employee", data);
    toast.success("Pengurus berhasil diunggah", { id: toastId });
    return { result: data };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const updateMember = async (member: Member) => {
  const toastId = toast.loading("Memperbaharui pengurus");
  try {
    let data: Member = member;

    if (data.image?.file) {
      toast.loading("Memperbaharui gambar", { id: toastId });
      data.image.downloadUrl = await sendFile(
        data.image.file,
        `event/${data.id}`
      );
      delete data.image.file;
    }

    toast.loading("Memperbaharui pengurus", { id: toastId });
    await axios.patch("/api/employee", data);
    toast.success("Pengurus berhasil diperbaharui", { id: toastId });
    return { result: data };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};
