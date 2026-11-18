import { getSiteData } from "@/lib/site-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GalleryLightbox } from "./gallery-lightbox";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const brand = data.brand || "Matchfly TV";
  const version = data.app?.version || "v6.4.0";
  const title = `Download ${brand} APK (${version}) — Free Live Sports on Android`;
  const description = `Watch live sports free on your Android device — cricket, football, tennis, kabaddi, hockey and more. Direct fast download APK.`;
  const ogImageUrl = "/images/og-matchfly.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/download",
      siteName: brand,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1024,
          height: 576,
          alt: `Download ${brand} APK`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function DownloadPage() {
  const data = await getSiteData();
  const app = data.app || {};
  const version = app.version || "v1.0.0";
  const size = app.size || "12.4 MB";
  const requirement = app.requirement || "Android 7.0+";
  const price = app.price || "Free";

  const brandParts = (data.brand || "Matchfly TV").split(" ");
  const mainName = brandParts[0] || "Matchfly";
  const suffix = brandParts.slice(1).join(" ") || "TV";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
      <Header data={data} />

      <main style={{ flex: 1, paddingBottom: 60 }}>
        {/* Upper Hero Section (matching the user's reference image) */}
        <section style={{ padding: "48px 20px 20px 20px", textAlign: "center", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: 1040, margin: "0 auto" }}>
            {/* Download Brand APK Title */}
            <h1
              style={{
                fontSize: "clamp(34px, 5.5vw, 52px)",
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-1.5px",
                margin: "0 0 16px 0",
              }}
            >
              Download{" "}
              <span style={{ color: data.accent || "#ff2d8d" }}>
                {mainName}
              </span>{" "}
              {suffix} APK
            </h1>

            {/* Subtitle Description with Badges */}
            <p
              style={{
                fontSize: "clamp(16px, 2.2vw, 18px)",
                color: "#52657d",
                maxWidth: 720,
                margin: "0 auto 40px auto",
                lineHeight: 1.7,
              }}
            >
              Watch live sports free on your Android device — cricket, football, tennis, kabaddi, hockey and more.{" "}
              <mark
                style={{
                  backgroundColor: "#fdf2f8",
                  color: "#be185d",
                  padding: "3px 9px",
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 13,
                  display: "inline-block",
                  marginLeft: 4,
                }}
              >
                ▣ Live TV app
              </mark>
            </p>

            {/* A Closer Look Section Title */}
            <div style={{ marginBottom: 16 }}>
              <h2
                style={{
                  fontSize: "clamp(26px, 3.8vw, 36px)",
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-0.8px",
                  margin: "0 0 8px 0",
                }}
              >
                A Closer Look at {data.brand}
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
                Simple, clean and made for watching the match
              </p>
            </div>

            {/* Taller, clearly visible screenshots gallery */}
            <div style={{ marginTop: 20 }}>
              <GalleryLightbox images={data.gallery || []} brand={data.brand} />
            </div>
          </div>
        </section>

        {/* Dedicated Download Card Section */}
        <section id="get-download" style={{ padding: "40px 20px 40px 20px" }}>
          <div
            style={{
              maxWidth: 580,
              margin: "0 auto",
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 24,
              padding: "38px 28px",
              textAlign: "center",
              boxShadow: "0 12px 35px rgba(0,0,0,0.06)",
            }}
          >
            {/* Top Download Icon */}
            <div
              style={{
                width: 68,
                height: 68,
                margin: "0 auto 18px auto",
                borderRadius: 18,
                backgroundColor: "#f0fdf4",
                border: "2px solid #bbf7d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: data.accent || "#ff2d8d",
                fontWeight: "bold",
              }}
            >
              ↓
            </div>

            {/* Brand + Version Title */}
            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: 26,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.5px",
              }}
            >
              {data.brand} {version}
            </h2>

            {/* Subtitle Meta Badges */}
            <div
              style={{
                fontSize: 13,
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              <span>Stable Release</span>
              <span>·</span>
              <span>{size}</span>
              <span>·</span>
              <span>{requirement}</span>
              <span>·</span>
              <span
                style={{
                  backgroundColor: "#fdf2f8",
                  color: "#be185d",
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                📱 Get Android Phones
              </span>
            </div>

            {/* 3 Stat Columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                padding: "16px 0",
                borderTop: "1px solid #f1f5f9",
                borderBottom: "1px solid #f1f5f9",
                marginBottom: 26,
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: data.accent || "#ff2d8d" }}>{version}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>
                  Version
                </div>
              </div>
              <div style={{ borderLeft: "1px solid #f1f5f9", borderRight: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{size}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>
                  File Size
                </div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{price}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>
                  No Ads
                </div>
              </div>
            </div>

            {/* Big Primary Download Button */}
            <a
              href="/api/download"
              download
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "16px 24px",
                backgroundColor: data.accent || "#ff2d8d",
                color: "#ffffff",
                borderRadius: 14,
                fontSize: 18,
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: `0 8px 20px ${data.accent || "#ff2d8d"}44`,
                boxSizing: "border-box",
                transition: "all 0.2s",
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 22 }}>⇩</span>
              <span>Download APK Free</span>
            </a>

            {/* Alternative Links Info */}
            <div style={{ fontSize: 12, color: "#64748b", margin: "16px 0 12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span>Alternative download links</span>
              <span>·</span>
              <span
                style={{
                  backgroundColor: "#fdf2f8",
                  color: "#be185d",
                  padding: "2px 7px",
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                ▣ Free APK download
              </span>
            </div>

            {/* Alternative Link 2 */}
            <a
              href="/api/download?source=2"
              download
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "13px 20px",
                backgroundColor: "#ffffff",
                color: data.accent || "#ff2d8d",
                border: `2px solid ${data.accent || "#ff2d8d"}`,
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxSizing: "border-box",
                marginBottom: 10,
                transition: "all 0.2s",
              }}
            >
              <span>⇩</span>
              <span>Download Link 2</span>
            </a>

            {/* Alternative Link 3 */}
            <a
              href="/api/download?source=3"
              download
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "13px 20px",
                backgroundColor: "#ffffff",
                color: data.accent || "#ff2d8d",
                border: `2px solid ${data.accent || "#ff2d8d"}`,
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxSizing: "border-box",
                marginBottom: 20,
                transition: "all 0.2s",
              }}
            >
              <span>⇩</span>
              <span>Download Link 3</span>
            </a>

            {/* Trust Badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 13,
                color: "#15803d",
                fontWeight: 600,
                paddingTop: 8,
              }}
            >
              <span style={{ fontSize: 10 }}>●</span>
              <span>Safe · No malware · No root required</span>
            </div>
          </div>

          {/* Quick Steps Box */}
          <div
            style={{
              maxWidth: 580,
              margin: "30px auto 0 auto",
              padding: "24px 28px",
              borderRadius: 16,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
              📲 How to install on your Android device
            </h3>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "#475569", lineHeight: 1.8 }}>
              <li>Tap the <strong>Download APK Free</strong> button above to download the latest APK file.</li>
              <li>When the download finishes, tap the downloaded file notification.</li>
              <li>If prompted, allow <em>Install unknown apps</em> in your device settings.</li>
              <li>Tap <strong>Install</strong> and start streaming live sports!</li>
            </ol>
          </div>
        </section>
      </main>

      <Footer data={data} />
    </div>
  );
}
