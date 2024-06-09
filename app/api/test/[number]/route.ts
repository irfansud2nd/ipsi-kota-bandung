import { apiProtect } from "@/lib/admin/adminActions";
import {
  getContingenAtEvents,
  getContingentByEmail,
} from "@/lib/contingent/contingentActions";
import supabase from "@/lib/database/supabase";
import { getPaymentsByContingentRegistrationId } from "@/lib/payment/paymentActions";
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

  const data = await getPaymentsByContingentRegistrationId(31);

  // const data = await getContingenAtEvents(
  //   "3122e64b-df2c-4723-816b-4a2db5c7dc4c"
  // );

  // const data = await getContingentByEmail("irfansud2nd@gmail.com");

  // const data = await supabase.rpc("sql",{
  //   sql:`SELECT
  //   c.*,
  //   count_registered_athletes_by_contingent_id(c.id) AS jumlah_atlet
  //    FROM contingents c;`
  // })

  // if (data.error) {
  //   return NextResponse.json(data.error, { status: 500 });
  // }

  return NextResponse.json({ result: data }, { status: 200 });

  // const { data, error } = await supabase
  //   .from("contingentAtEvents")
  //   .select("payment->>total.sum()");

  // if (error) return NextResponse.json(error, { status: 500 });
  // return NextResponse.json({ result: data }, { status: 200 });
};
