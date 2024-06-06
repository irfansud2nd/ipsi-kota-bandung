import {
  Athlete,
  getDummyAthletes,
} from "@/lib/athlete/external/athleteConstants";
import supabase from "@/lib/database/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const athlete: Athlete = await req.json();

  const { error } = await supabase.from("athletes").insert(athlete);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json({ message: "Success" }, { status: 200 });
};
