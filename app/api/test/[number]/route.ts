import { apiProtect } from "@/lib/admin/adminActions";
import supabase from "@/lib/database/supabase";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { number: number } }
) => {
  // const error: number[] = [];
  // const number = Number(params.number);

  // console.log(
  //   `${error.includes(number) ? "Error" : "Success"} from api/test/${number}`
  // );

  // return NextResponse.json(
  //   {
  //     message: `${
  //       error.includes(number) ? "Error" : "Success"
  //     } from api/test/${number}`,
  //   },
  //   { status: error.includes(number) ? 500 : 200 }
  // );

  const { data, error } = await supabase
    .from("contingentAtEvents")
    .select("payment->>total.sum()");

  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json({ result: data }, { status: 200 });
};
