import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const data = await getSiteData();
  const url = new URL(request.url);
  const source = url.searchParams.get("source");

  let apkUrl = data.apkUrl;
  if (source === "2" && data.apkUrl2) {
    apkUrl = data.apkUrl2;
  } else if (source === "3" && data.apkUrl3) {
    apkUrl = data.apkUrl3;
  }

  if (apkUrl && (apkUrl.startsWith("http://") || apkUrl.startsWith("https://"))) {
    try {
      const upstreamRes = await fetch(apkUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Android; Mobile)" },
        cache: "no-store",
      });

      if (upstreamRes.ok && upstreamRes.body) {
        const safeBrand = (data.brand || "MatchflyTV").replace(/[^a-zA-Z0-9_-]/g, "_");
        const safeVersion = (data.app?.version || "v6.4.0").replace(/[^a-zA-Z0-9._-]/g, "_");
        const fileName = `${safeBrand}_${safeVersion}.apk`;
        const contentLength = upstreamRes.headers.get("content-length");

        const headers: Record<string, string> = {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "public, max-age=3600",
        };
        if (contentLength) {
          headers["Content-Length"] = contentLength;
        }

        return new NextResponse(upstreamRes.body as any, {
          status: 200,
          headers,
        });
      }
    } catch (err) {
      console.error("External APK streaming error, falling back to redirect:", err);
    }

    return NextResponse.redirect(apkUrl, { status: 302 });
  }

  if (apkUrl && apkUrl.startsWith("/")) {
    const relativePath = apkUrl.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), "public", relativePath);

    if (fs.existsSync(filePath)) {
      const fileStat = fs.statSync(filePath);
      const fileStream = fs.createReadStream(filePath);
      const safeBrand = (data.brand || "MatchflyTV").replace(/[^a-zA-Z0-9_-]/g, "_");
      const safeVersion = (data.app?.version || "latest").replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${safeBrand}_${safeVersion}.apk`;

      const readableStream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (err) => controller.error(err));
        },
        cancel() {
          fileStream.destroy();
        },
      });

      return new NextResponse(readableStream, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Length": fileStat.size.toString(),
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }

  return NextResponse.redirect(new URL("/download", url.origin), { status: 302 });
}
