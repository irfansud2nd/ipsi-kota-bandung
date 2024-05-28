import { getPermittedRoles } from "@/lib/admin/adminFunctions";
import { apiProtect } from "@/lib/admin/adminActions";
import supabase from "@/lib/database/supabase";
import { Event } from "@/lib/event/eventConstants";
import { NextRequest, NextResponse } from "next/server";

const access = getPermittedRoles("event");

export const POST = async (req: Request) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const event: Event = await req.json();

  const { error } = await supabase.from("events").insert(event);
  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Event berhasil disimpan" },
    { status: 200 }
  );
};

export const PATCH = async (req: Request) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const event: Event = await req.json();

  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", event.id);
  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Event berhasil diperbaharui", result: data },
    { status: 200 }
  );
};

export const DELETE = async (req: NextRequest) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json({ message: "ID not found" }, { status: 500 });

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Event berhasil dihapus" },
    { status: 200 }
  );
};
