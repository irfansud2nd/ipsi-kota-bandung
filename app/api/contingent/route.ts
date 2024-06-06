import { apiProtect } from "@/lib/admin/adminActions";
import { Contingent } from "@/lib/contingent/contingentConstants";
import supabase from "@/lib/database/supabase";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const contingent: Contingent = await req.json();

  const { response } = await apiProtect({
    permittedEmail: contingent.createdBy,
  });
  if (response) return response;

  const { data: duplicateData, error: duplicateError } = await supabase
    .from("contingents")
    .select("name")
    .ilike("name", `%${contingent.name}%`);

  if (duplicateError) return NextResponse.json(duplicateError, { status: 500 });

  if (duplicateData.length) {
    return NextResponse.json(
      {
        message: `Terdapat duplikasi kontingen yang sudah terdaftar sebagai berikut 
        ${duplicateData.map((item) => item.name).join(", ")}`,
        code: "duplicate",
      },
      { status: 500 }
    );
  }

  const { error } = await supabase.from("contingents").insert(contingent);

  if (error?.code == "23505")
    return NextResponse.json(
      { message: "1 Email hanya diperbolehkan mendaftarkan 1 Kontingen" },
      { status: 500 }
    );

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Kontingen berhasil didaftarkan" },
    { status: 200 }
  );
};

export const PATCH = async (req: Request) => {
  const contingent: Contingent & { changeName?: boolean } = await req.json();

  const { response } = await apiProtect({
    permittedEmail: contingent.createdBy,
  });
  if (response) return response;

  if (contingent.changeName) {
    const { data: duplicateData, error: duplicateError } = await supabase
      .from("contingents")
      .select("name")
      .ilike("name", `%${contingent.name}%`);

    if (duplicateError)
      return NextResponse.json(duplicateError, { status: 500 });

    if (duplicateData.length) {
      return NextResponse.json(
        {
          message: `Terdapat duplikasi kontingen yang sudah terdaftar sebagai berikut 
        ${duplicateData.map((item) => item.name).join(", ")}`,
          code: "duplicate",
        },
        { status: 500 }
      );
    }
  }

  const { error } = await supabase
    .from("contingents")
    .update(contingent)
    .eq("id", contingent.id);

  if (error) return NextResponse.json(error, { status: 500 });

  return NextResponse.json(
    { message: "Kontingen berhasil diperbaharui" },
    { status: 200 }
  );
};
