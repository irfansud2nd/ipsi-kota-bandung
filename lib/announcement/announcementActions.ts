"use server";
import { apiProtect } from "../admin/adminActions";
import { ServerAction } from "../constants";
import supabase from "../database/supabase";
import { action } from "../functions";
import { Announcement } from "./announcementConstants";

// ANNOUNCEMET
// READ
export const getAnnouncement = async (): Promise<
  ServerAction<Announcement>
> => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select()
      .limit(1)
      .returns<Announcement[]>();

    if (error) throw new Error(error.message);

    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updateAnnouncement = async (
  announcement: Announcement
): Promise<ServerAction<Announcement>> => {
  let data = announcement;
  data.updated_at = Date.now();
  try {
    const response = await apiProtect({ directory: "announcement" });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("announcements")
      .update(announcement)
      .eq("id", announcement.id);

    if (error) throw new Error(error.message);

    return action.success(announcement);
  } catch (error) {
    return action.error(error);
  }
};
