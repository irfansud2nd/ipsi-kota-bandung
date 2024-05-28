import { apiProtect } from "@/lib/admin/adminActions";
import { getPermittedRoles } from "@/lib/admin/adminFunctions";
import supabase from "@/lib/database/supabase";
import { NextResponse } from "next/server";

const access = getPermittedRoles("employee");

export const POST = async (req: Request) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const member = await req.json();
  delete member.order;

  const { error } = await supabase.from("employees").insert(member);
  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Pengurus berhasil disimpan" },
    { status: 200 }
  );
};

export const PATCH = async (req: Request) => {
  const { response } = await apiProtect({ roles: access });
  if (response) return response;

  const member = await req.json();
  delete member.order;

  const { data, error } = await supabase
    .from("employees")
    .update(member)
    .eq("id", member.id)
    .select();
  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Pengurus berhasil diperbaharui", result: data },
    { status: 200 }
  );
};
