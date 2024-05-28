import supabase from "@/lib/database/supabase";
import { Announcement } from "@/lib/announcement/announcementConstants";
import { NextResponse } from "next/server";
import { apiProtect } from "@/lib/admin/adminActions";

export const PATCH = async (req: Request) => {
  const { response } = await apiProtect({ directory: "announcement" });
  if (response) return response;

  const announcement: Announcement = await req.json();

  const { data, error } = await supabase
    .from("announcements")
    .update(announcement)
    .eq("id", announcement.id)
    .select();
  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Pengumuman berhasil diperbaharui", result: data },
    { status: 200 }
  );
};
