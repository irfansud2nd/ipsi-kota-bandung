import { apiProtect } from "@/lib/admin/adminActions";
import { authOptions } from "@/lib/auth/authOptions";
import {
  Contingent,
  ContingentAtEvent,
} from "@/lib/contingent/contingentConstants";
import supabase from "@/lib/database/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { response } = await apiProtect({ loggedInOnly: true });
  if (response) return response;

  const contingent: ContingentAtEvent = await req.json();
  const { data, error } = await supabase
    .from("contingentAtEvents")
    .insert(contingent)
    .select();

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Kontingen berhasil ditambahkan ke event", result: data },
    { status: 200 }
  );
};

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const email = (await getServerSession())?.user?.email || undefined;
  const eventId = searchParams.get("eventId");

  const { response } = await apiProtect({ permittedEmail: email });
  if (response) return response;

  let contingent: Contingent | undefined = undefined;
  let contingentAtEvents: ContingentAtEvent[] = [];

  const { data: contingents, error: contingentsError } = await supabase
    .from("contingents")
    .select()
    .eq("createdBy", email);

  if (contingentsError)
    return NextResponse.json(contingentsError, { status: 500 });

  contingent = contingents[0];

  if (contingent) {
    const { data, error } = await supabase
      .from("contingentAtEvents")
      .select()
      .eq("contingentId", contingent.id);

    if (error) return NextResponse.json(error, { status: 500 });

    contingentAtEvents = data;
  }

  return NextResponse.json(
    { result: { contingent: contingent, contingentAtEvents } },
    { status: 200 }
  );
};

export const PATCH = async (req: Request) => {
  const { response } = await apiProtect({ loggedInOnly: true });
  if (response) return response;

  const contingentAtEvent: ContingentAtEvent = await req.json();
  const { data, error } = await supabase
    .from("contingentAtEvents")
    .update(contingentAtEvent)
    .eq("registrationId", contingentAtEvent.registrationId)
    .select();

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Kontingen berhasil diperbahharui", result: data },
    { status: 200 }
  );
};
