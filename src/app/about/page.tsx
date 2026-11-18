import { getSiteData } from "@/lib/site-data";
import { Header } from "@/components/Header";
import { getDownloadHref } from "@/lib/download-url";
import { Footer } from "@/components/Footer";
import { ContentRenderer } from "@/components/ContentRenderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  return {
    title: `${data.about?.title || `About ${data.brand}`} — Free Live Sports App`,
    description: data.about?.subtitle || `Learn more about ${data.brand} free sports streaming app for Android.`,
  };
}

export default async function AboutPage() {
  const data = await getSiteData();
  const downloadHref = getDownloadHref(data);
  const isDownloadable = downloadHref.startsWith("/api/download");

  const brandParts = (data.brand || "Matchfly TV").split(" ");
  const mainName = brandParts[0] || "Matchfly";
  const suffix = brandParts.slice(1).join(" ") || "TV";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
      <Header data={data} />

      <main style={{ flex: 1, padding: "50px 20px 80px 20px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          {/* Header Title Section (matching reference screenshot) */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-1.5px",
                margin: "0 0 14px 0",
              }}
            >
              About{" "}
              <span style={{ color: data.accent || "#ff2d8d" }}>
                {mainName} <span style={{ color: "#111827" }}>{suffix}</span>
              </span>
            </h1>

            {data.about?.subtitle && (
              <p
                style={{
                  fontSize: 18,
                  color: "#52657d",
                  maxWidth: 620,
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                {data.about.subtitle}
              </p>
            )}
          </div>

          {/* Main Body Content */}
          <div
            style={{
              backgroundColor: "#ffffff",
              lineHeight: 1.8,
            }}
          >
            <ContentRenderer content={data.about?.content || ""} />
          </div>

          {/* Call to Action Box */}
          <div
            style={{
              marginTop: 56,
              padding: "36px 28px",
              borderRadius: 16,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
              Catch the Next Match on {data.brand}
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: 15 }}>
              Download the free APK now and stream cricket, football and other live sports in HD.
            </p>
            <a
              href={downloadHref}
              download={isDownloadable ? true : undefined}
              className="primary"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              ⇩ Download {data.brand} APK Free
            </a>
          </div>
        </div>
      </main>

      <Footer data={data} />
    </div>
  );
}

