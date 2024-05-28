import { getPermittedRoles } from "@/lib/admin/adminFunctions";
import { apiProtect } from "@/lib/admin/adminActions";
import { News } from "@/lib/news/newsConstants";
import supabase from "@/lib/database/supabase";
import { NextRequest, NextResponse } from "next/server";

const access = getPermittedRoles("news");

export const POST = async (req: Request) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const news: News = await req.json();

  const { error } = await supabase.from("news").insert(news);
  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Berita berhasil disimpan" },
    { status: 200 }
  );
};

export const PATCH = async (req: Request) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const news: News = await req.json();

  const { data, error } = await supabase
    .from("news")
    .update(news)
    .eq("id", news.id)
    .select();
  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Berita berhasil diperbaharui", result: data },
    { status: 200 }
  );
};

export const DELETE = async (req: NextRequest) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json({ message: "ID not found" }, { status: 500 });

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Berita berhasil dihapus" },
    { status: 200 }
  );
};
