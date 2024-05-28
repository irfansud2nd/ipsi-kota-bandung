import { SpecialUserRole } from "@/lib/admin/adminConstants";
import {
  AttendanceToken,
  InternalAthleteRole,
} from "@/lib/athlete/internal/internalAthleteConstants";
import { apiProtect } from "@/lib/admin/adminActions";
import supabase from "@/lib/database/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getAttendanceId } from "@/lib/athlete/internal/internalAthleteFunctions";
import { invalidIdentifier } from "@/lib/constants";

const access: SpecialUserRole[] = ["pelatih", "master"];

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const role = searchParams.get("role");

  if (!role) return invalidIdentifier;

  const id = getAttendanceId(role as InternalAthleteRole);

  let getData = supabase
    .from("attendanceTokens")
    .select()
    .eq("role", role)
    .eq("id", id);

  const { data, error } = await getData;

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { result: data.length ? data[0] : undefined },
    { status: 200 }
  );
};

export const POST = async (req: Request) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const data: AttendanceToken = await req.json();

  const { error } = await supabase.from("attendanceTokens").insert(data);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Token berhasil dibuat" },
    { status: 200 }
  );
};

export const PATCH = async (req: Request) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const data: AttendanceToken = await req.json();

  const { error } = await supabase
    .from("attendanceTokens")
    .update({ status: data.status })
    .eq("token", data.token);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Token berhasil dibuat" },
    { status: 200 }
  );
};
