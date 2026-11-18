import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ImageModel } from "@/lib/models/image";

export const dynamic = "force-dynamic";

const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Session expired or unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Determine extension from filename or mime type
    const rawExt = path.extname(file.name || "").toLowerCase().replace(".", "");
    const mimeExt = file.type?.startsWith("image/")
      ? file.type.split("/")[1]?.toLowerCase().replace("jpeg", "jpg")
      : "";
    const extension = rawExt || mimeExt || "png";

    if (!allowedExtensions.has(extension) && !file.type?.startsWith("image/")) {
      return NextResponse.json(
        {
          error: `File type "${extension || file.type}" is not supported. Please choose a JPG, PNG, WEBP or GIF image.`,
        },
        { status: 400 }
      );
    }

    // 25 MB max size
    const maxSizeBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "Image size must be 25 MB or smaller." }, { status: 400 });
    }

    const cleanExt = extension === "jpeg" ? "jpg" : extension;
    const filename = `${randomUUID()}.${cleanExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || `image/${cleanExt}`;

    // 1. Always save to MongoDB Atlas (works on Vercel, Docker, Railway, Serverless)
    await connectDb();
    await ImageModel.create({
      filename,
      contentType,
      data: buffer,
      size: buffer.length,
    });

    // 2. Best-effort local file write (works in local dev, ignored on read-only environments like Vercel)
    try {
      const directory = path.join(process.cwd(), "public", "uploads");
      await mkdir(directory, { recursive: true });
      await writeFile(path.join(directory, filename), buffer);
    } catch {
      // Ignored: read-only filesystem on Vercel
    }

    return NextResponse.json({
      url: `/uploads/${filename}`,
      alt: file.name || "App Screenshot",
    });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image." },
      { status: 500 }
    );
  }
}
