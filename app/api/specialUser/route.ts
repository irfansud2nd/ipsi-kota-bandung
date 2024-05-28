import { apiProtect } from "@/lib/admin/adminActions";
import { SpecialUser, SpecialUserRole } from "@/lib/admin/adminConstants";
import { invalidIdentifier } from "@/lib/constants";
import supabase from "@/lib/database/supabase";
import { NextRequest, NextResponse } from "next/server";

const permittedRoles = (roleToEdit: SpecialUserRole[]) => {
  let roles: SpecialUserRole[] = ["master"];
  if (roleToEdit.find((item) => item.includes("athlete")))
    roles.push("pelatih");
  return roles;
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;

  const role = searchParams.get("role");
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const email = searchParams.get("email");

  let getData = supabase
    .from("specialUsers")
    .select()
    .order("name")
    .range(page * limit - limit, page * limit - 1);

  if (role) getData = getData.contains("roles", [role]);

  if (email)
    getData = supabase.from("specialUsers").select().eq("email", email);

  const { data, error } = await getData;

  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json({ result: data }, { status: 200 });
};

export const POST = async (req: Request) => {
  const data: SpecialUser = await req.json();

  const { response } = await apiProtect({ roles: permittedRoles(data.roles) });
  if (response) return response;

  const { error } = await supabase.from("specialUsers").upsert(data);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Akun berhasil ditambahkan" },
    { status: 200 }
  );
};

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const role = searchParams.get("role") as SpecialUserRole;
  const email = searchParams.get("email");

  if (!role || !email) return invalidIdentifier;

  const { response } = await apiProtect({ roles: permittedRoles([role]) });
  if (response) return response;

  const { error } = await supabase
    .from("specialUsers")
    .delete()
    .eq("email", email)
    .contains("roles", [role]);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Akun berhasil dihapus" },
    { status: 200 }
  );
};

export const PATCH = async (req: Request) => {
  const data: SpecialUser = await req.json();

  const { error } = await supabase
    .from("specialUsers")
    .update(data)
    .eq("email", data.email);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Akun berhasil diperbaharui" },
    { status: 200 }
  );
};
