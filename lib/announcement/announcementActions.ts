"use server";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { Announcement } from "./announcementConstants";

// ANNOUNCEMET
// READ
export const getAnnouncement = async () => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select()
      .limit(1)
      .returns<Announcement[]>();
    if (error) throw new Error(error.message);

    return data[0];
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateAnnouncement = async (announcement: Announcement) => {
  let data = announcement;
  data.updated_at = Date.now();
  try {
    const response = await apiProtect({ directory: "announcement" });
    if (response) throw response;

    const { error } = await supabase
      .from("announcements")
      .update(announcement)
      .eq("id", announcement.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
