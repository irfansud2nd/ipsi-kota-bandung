import {
  Attendance,
  AttendanceType,
} from "@/lib/athlete/internal/internalAthleteConstants";
import { apiProtect } from "@/lib/admin/adminActions";
import supabase from "@/lib/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { invalidIdentifier } from "@/lib/constants";

export const POST = async (req: Request) => {
  const data: Attendance = await req.json();

  const { response } = await apiProtect({
    permittedEmail: data.email,
    roles: ["pelatih"],
  });
  if (response) return response;

  const { error } = await supabase.from("attendances").insert(data);
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(
    { message: "Kehadiran berhasil dikirim" },
    { status: 200 }
  );
};

export const PATCH = async (req: Request) => {
  const data: { id: number; type: AttendanceType } = await req.json();

  if (!data || !data.id || !data.type) return invalidIdentifier;

  const { response } = await apiProtect({ roles: ["pelatih"] });
  if (response) return response;

  const { error } = await supabase
    .from("attendances")
    .update({ type: data.type })
    .eq("id", data.id);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Kehadiran berhasil diperbaharui" },
    { status: 200 }
  );
};

export const DELETE = async (req: NextRequest) => {
  const { response } = await apiProtect({ roles: ["pelatih"] });
  if (response) return response;

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return invalidIdentifier;

  const { error } = await supabase.from("attendances").delete().eq("id", id);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Kehadiran berhasil dihapus" },
    { status: 200 }
  );
};
