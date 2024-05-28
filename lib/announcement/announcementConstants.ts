import * as yup from "yup";

export type Announcement = {
  id: string;
  text: string;
  updaterEmail: string;
  updatedAt: number;
};

export const announcementSchema = yup.object({
  text: yup.string().required("Tolong lengkapi teks pengumuman"),
});
