import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { SiteSettingsModel } from "@/lib/models/site-settings";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = file.name || "app.apk";
    if (!filename.toLowerCase().endsWith(".apk")) {
      return NextResponse.json({ error: "Please upload a valid .apk file." }, { status: 400 });
    }

    const maxSizeBytes = 250 * 1024 * 1024; // 250 MB limit
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "APK file size must be less than 250 MB." }, { status: 400 });
    }

    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFilename = `${Date.now()}-${cleanName}`;
    const directory = path.join(process.cwd(), "public", "uploads", "apks");

    await mkdir(directory, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(directory, uniqueFilename), buffer);

    const apkUrl = `/uploads/apks/${uniqueFilename}`;
    const sizeInMB = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // Persist to database immediately
    try {
      await connectDb();
      await SiteSettingsModel.findOneAndUpdate(
        { key: "main" },
        {
          $set: {
            apkUrl,
            "app.size": sizeInMB,
            "app.fileType": "APK (.apk)",
            key: "main",
          },
        },
        { upsert: true, new: true }
      );
      revalidatePath("/");
      revalidatePath("/download");
      revalidatePath("/features");
      revalidatePath("/install-guide");
    } catch (dbErr) {
      console.error("DB update error after APK upload:", dbErr);
    }

    return NextResponse.json({
      url: apkUrl,
      filename: cleanName,
      size: sizeInMB,
      message: "APK uploaded successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload APK file" },
      { status: 500 }
    );
  }
}

