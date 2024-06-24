import axios from "axios";
import { toast } from "sonner";
import { v4 } from "uuid";
import { Championship, Event, EventSql, championships } from "./eventConstants";
import { sendFile, toastError } from "../form/formFunctions";
import { compare, getFileUrl } from "../functions";
import { deleteFile } from "../actions";
import { addEventSql, deleteEventSql, updateEventSql } from "./eventActions";

export const sendEvent = async (event: Event) => {
  const toastId = toast.loading("Mengunggah event");

  try {
    const id = v4();
    let data: Event = { ...event, id, created_at: Date.now() };
    const { imageUrl } = getFileUrl("event", data.id);

    // SEND GAMBAR
    if (!event.image.file)
      throw { message: "Image not found", code: "no-image" };
    toast.loading("Mengunggah gambar", { id: toastId });
    data.image.downloadUrl = await sendFile(event.image.file, imageUrl);
    delete data.image.file;

    // SEND EVENT
    toast.loading("Mengunggah event", { id: toastId });
    await addEventSql(eventToEventSql(data));
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
    const { imageUrl } = getFileUrl("event", data.id);

    if (event.image.file) {
      // DELETE OLD IMAGE
      toast.loading("Memperbaharui gambar", { id: toastId });
      const downloadUrl = await sendFile(event.image.file, imageUrl);
      data.image.downloadUrl = downloadUrl;
      delete data.image.file;
    }
    // UPDATE EVENT
    toast.loading("Memperbaharui event", { id: toastId });
    await updateEventSql(eventToEventSql(data));
    toast.success("Event berhasil diperbaharui", { id: toastId });
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// DELETE EVENTS
export const deleteEvent = async (event: Event) => {
  const toastId = toast.loading("Menghapus event");
  const { imageUrl } = getFileUrl("event", event.id);

  try {
    // DELETE GAMBAR
    toast.loading("Menghapus gambar", { id: toastId });
    await deleteFile(imageUrl);

    // DELETE EVENT
    toast.loading("Menghapus event", { id: toastId });
    await deleteEventSql(eventToEventSql(event));
    toast.success("Event berhasil dihapus", { id: toastId });
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
    .sort(compare("created_at", "desc"))
    .slice(page * limit - limit, page * limit);
};

export const getChampionship = (id: string) => {
  return championships.find((item) => item.id == id);
};

export const isLevelRookieOnly = (
  level: string,
  championship: Championship
) => {
  if (
    championship.matchCategory.find((item) => item.level == level)?.rookieOnly
  )
    return true;
  return false;
};

// OTHERS
export const eventSqlToEvent = (eventSql: EventSql) => {
  const result: Event = {
    ...eventSql,
    image: {
      downloadUrl: eventSql.image,
    },
  };
  return result;
};

export const eventToEventSql = (event: Event) => {
  const result: EventSql = {
    ...event,
    image: event.image.downloadUrl,
  };
  return result;
};
