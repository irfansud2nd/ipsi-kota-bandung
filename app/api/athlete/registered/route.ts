import { apiProtect } from "@/lib/admin/adminActions";
import {
  Athlete,
  AthleteAtEvent,
} from "@/lib/athlete/external/athleteConstants";
import supabase from "@/lib/database/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const email = (await getServerSession())?.user?.email || undefined;
  const championshipId = searchParams.get("championshipId");

  if (!championshipId)
    return NextResponse.json(
      { message: "event ID not found" },
      { status: 500 }
    );

  const { data: athletes, error: athletesError } = await supabase
    .from("athletes")
    .select()
    .eq("createdBy", email);

  if (athletesError) return NextResponse.json(athletesError, { status: 500 });

  let athleteAtEvents: AthleteAtEvent[] = [];
  if (athletes.length) {
    const { data, error } = await supabase
      .from("athleteAtEvents")
      .select()
      .in(
        "athleteId",
        athletes.map((athlete) => athlete.id)
      )
      .eq("championshipId", championshipId);

    if (error) return NextResponse.json(error, { status: 500 });

    athleteAtEvents = data;
  }

  return NextResponse.json(
    { result: { athletes, athleteAtEvents } },
    { status: 200 }
  );
};

export const POST = async (req: Request) => {
  const athleteAtevent: AthleteAtEvent = await req.json();

  const { response } = await apiProtect({ loggedInOnly: true });
  if (response) return response;

  const { data, error } = await supabase
    .from("athleteAtEvents")
    .insert(athleteAtevent)
    .select();

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json({ result: data }, { status: 200 });
};

export const PATCH = async (req: Request) => {
  const athleteAtevent: AthleteAtEvent = await req.json();

  const { response } = await apiProtect({ loggedInOnly: true });
  if (response) return response;

  const { error } = await supabase
    .from("athleteAtEvents")
    .update(athleteAtevent)
    .eq("registrationId", athleteAtevent.registrationId);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { result: "Pertindingan berhasil diperbaharui" },
    { status: 200 }
  );
};

export const DELETE = async (req: NextRequest) => {
  const registrationId = req.nextUrl.searchParams.get("registrationId");
  const athleteId = req.nextUrl.searchParams.get("athleteId");

  if (!registrationId || !athleteId)
    return NextResponse.json(
      { message: "Invalid Identifier" },
      { status: 500 }
    );

  const { data: emailData, error: emailError } = await supabase
    .from("athletes")
    .select("createdBy")
    .eq("id", athleteId);

  if (emailError) return NextResponse.json(emailError, { status: 500 });

  const email: string | undefined = emailData.length
    ? emailData[0].createdBy
    : undefined;

  if (!email)
    return NextResponse.json(
      { message: "Atlet tidak ditemukan" },
      { status: 500 }
    );

  const { response } = await apiProtect({ permittedEmail: email });
  if (response) return response;

  const { error } = await supabase
    .from("athleteAtEvents")
    .delete()
    .eq("registrationId", registrationId);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Pertandingan berhasil dihapus" },
    { status: 200 }
  );
};
