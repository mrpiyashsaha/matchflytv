import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { SiteSettingsModel } from "@/lib/models/site-settings";
import { sanitizeSiteData } from "@/lib/site-data";

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDb();
    const body = await request.json();
    const settings = await SiteSettingsModel.findOneAndUpdate(
      { key: "main" },
      { $set: { ...body, key: "main" } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    revalidatePath("/");
    revalidatePath("/download");
    revalidatePath("/features");
    revalidatePath("/install-guide");
    revalidatePath("/about");
    revalidatePath("/privacy");
    revalidatePath("/terms");

    return NextResponse.json(sanitizeSiteData(settings));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database unavailable" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDb();
    await SiteSettingsModel.deleteOne({ key: "main" });
    revalidatePath("/");
    revalidatePath("/download");
    revalidatePath("/features");
    revalidatePath("/install-guide");
    revalidatePath("/about");
    revalidatePath("/privacy");
    revalidatePath("/terms");
    return NextResponse.json({ ok: true, message: "Saved settings deleted. Public defaults restored." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database unavailable" },
      { status: 500 }
    );
  }
}
