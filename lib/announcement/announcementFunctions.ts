import axios from "axios";
import { Announcement } from "./announcementConstants";
import { toast } from "sonner";
import { toastError } from "../form/formFunctions";

export const updateAnnouncement = async (announcement: Announcement) => {
  const toastId = toast.loading("Memperbaharui pengumuman");
  try {
    let data: Announcement = { ...announcement };
    data.updatedAt = Date.now();
    await axios.patch("/api/announcement", data);
    toast.success("Pengumuman berhasil diperbaharui", { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};
