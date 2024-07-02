import { toast } from "sonner";
import { v4 } from "uuid";
import { Championship, Event, EventSql, championships } from "./eventConstants";
import { sendFile, toastError } from "../form/formFunctions";
import { compare, getFileUrl } from "../functions";
import { deleteFile } from "../actions";
import {
  addEventSql,
  deleteEventSql,
  getEventSql,
  getEventsSql,
  updateEventSql,
} from "./eventActions";
import { cache } from "react";

// EVENT
// CREATE
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

    const { error } = await addEventSql(eventToEventSql(data));
    if (error) throw error;

    toast.success("Event berhasil diunggah", { id: toastId });
    return { result: data };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// READ
export const getEvent = cache(async (id: string) => {
  try {
    const { result, error } = await getEventSql(id);

    if (error) throw error;

    const event = eventSqlToEvent(result);

    return event;
  } catch (error) {
    throw error;
  }
});

// UPDATE
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

    const { error } = await updateEventSql(eventToEventSql(data));
    if (error) throw error;

    toast.success("Event berhasil diperbaharui", { id: toastId });
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// DELETE
export const deleteEvent = async (event: Event) => {
  const toastId = toast.loading("Menghapus event");
  const { imageUrl } = getFileUrl("event", event.id);

  try {
    // DELETE GAMBAR
    toast.loading("Menghapus gambar", { id: toastId });
    const { error: deleteFileError } = await deleteFile(imageUrl);
    if (deleteFileError) throw deleteFileError;

    // DELETE EVENT
    toast.loading("Menghapus event", { id: toastId });

    const { error: deleteEventSqlError } = await deleteEventSql(
      eventToEventSql(event)
    );
    if (deleteEventSqlError) throw deleteEventSqlError;

    toast.success("Event berhasil dihapus", { id: toastId });
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// EVENTS
// READ
export const getEvents = cache(
  async (page?: number, limit?: number, exception?: Event) => {
    try {
      const { result, error } = await getEventsSql(page, limit, exception);

      if (error) throw error;

      const events = result.map((eventSql) => eventSqlToEvent(eventSql));

      return events;
    } catch (error) {
      throw error;
    }
  }
);

// CHAMPIONSHIP
// READ
export const getChampionship = (id: string) => {
  return championships.find((item) => item.id == id);
};

// CHAMPIONSHIPS
// READ
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

// OTHERS
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
