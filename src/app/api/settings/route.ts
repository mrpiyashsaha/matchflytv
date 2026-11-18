import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load settings" }, { status: 500 });
  }
}
