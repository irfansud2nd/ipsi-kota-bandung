import { apiProtect } from "@/lib/admin/adminActions";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { number: number } }
) => {
  const error: number[] = [];
  const number = Number(params.number);

  console.log(
    `${error.includes(number) ? "Error" : "Success"} from api/test/${number}`
  );

  return NextResponse.json(
    {
      message: `${
        error.includes(number) ? "Error" : "Success"
      } from api/test/${number}`,
    },
    { status: error.includes(number) ? 500 : 200 }
  );
};
