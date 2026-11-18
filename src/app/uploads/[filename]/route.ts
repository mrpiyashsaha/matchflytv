import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { ImageModel } from "@/lib/models/image";
import path from "node:path";
import { readFile } from "node:fs/promises";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  props: { params: Promise<{ filename: string }> }
) {
  const { filename } = await props.params;

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  try {
    await connectDb();
    const doc = await ImageModel.findOne({ filename }).lean() as any;

    if (doc && doc.data) {
      const buffer = Buffer.isBuffer(doc.data)
        ? doc.data
        : Buffer.from(doc.data.buffer || doc.data);

      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": doc.contentType || "image/png",
          "Content-Length": String(buffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Local disk fallback (development)
    try {
      const localPath = path.join(process.cwd(), "public", "uploads", filename);
      const fileBuffer = await readFile(localPath);
      const ext = path.extname(filename).toLowerCase().replace(".", "");
      const mime =
        ext === "png"
          ? "image/png"
          : ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : ext === "webp"
          ? "image/webp"
          : "image/png";

      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": mime,
          "Content-Length": String(fileBuffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error serving uploaded image:", error);
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 });
  }
}

