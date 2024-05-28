import axios from "axios";
import { toast } from "sonner";
import { v4 } from "uuid";
import { Event, championships } from "./eventConstants";
import { sendFile, toastError } from "../form/formFunctions";
import { compare } from "../functions";

export const sendEvent = async (event: Event) => {
  const toastId = toast.loading("Mengunggah event");
  try {
    const id = v4();
    let data: Event = { ...event, id, createdAt: Date.now() };

    // SEND GAMBAR
    if (!event.image.file)
      throw { message: "Image not found", code: "no-image" };
    toast.loading("Mengunggah gambar", { id: toastId });
    data.image.downloadUrl = await sendFile(event.image.file, `event/${id}`);
    delete data.image.file;

    // SEND EVENT
    toast.loading("Mengunggah event", { id: toastId });
    await axios.post("/api/event", data);
    toast.success("Event berhasil diunggah", { id: toastId });
    return { result: data };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// UPDATE EVENT
export const updateEvent = async (event: Event) => {
  const toastId = toast.loading("Memperbaharui event");
  try {
    let data: Event = { ...event };
    if (event.image.file) {
      // DELETE OLD IMAGE
      toast.loading("Memperbaharui gambar", { id: toastId });
      const downloadUrl = await sendFile(event.image.file, `event/${event.id}`);
      data.image.downloadUrl = downloadUrl;
      delete data.image.file;
    }
    // UPDATE EVENT
    toast.loading("Memperbaharui event", { id: toastId });
    await axios.patch("/api/event", data);
    toast.success("Event berhasil diperbaharui", { id: toastId });
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// DELETE EVENTS
export const deleteEvent = async (event: Event) => {
  const toastId = toast.loading("Menghapus event");
  try {
    // DELETE GAMBAR
    toast.loading("Menghapus gambar", { id: toastId });
    await axios.delete(`/api/file?directory=event/${event.id}`);

    // DELETE EVENT
    toast.loading("Menghapus event", { id: toastId });
    const res = await axios.delete(`/api/event?id=${event.id}`);
    toast.success("Event berhasil dihapus", { id: toastId });
    return { response: res.data };
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

export const getChampionships = (
  page: number,
  limit: number,
  exception?: Event
) => {
  let result = championships;
  if (exception)
    result = result.filter((championship) => championship.id !== exception.id);
  return result
    .sort(compare("createdAt", "desc"))
    .slice(page * limit - limit, page * limit);
};
