import { NextRequest, NextResponse } from "next/server";

// API Route handler
export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");

  try {
    if (!src) throw new Error("Source not found");

    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer);
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to fetch the file, ${error}` },
      { status: 500 }
    );
  }
}
