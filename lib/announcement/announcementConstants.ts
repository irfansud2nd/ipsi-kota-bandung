import * as yup from "yup";

export type Announcement = {
  id: string;
  text: string;
  updater_email: string;
  updated_at: number;
};

export const announcementSchema = yup.object({
  text: yup.string().required("Tolong lengkapi teks pengumuman"),
});
