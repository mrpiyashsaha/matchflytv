import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeaturesGrid } from "@/components/FeaturesGrid";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const brand = data.brand || "Matchfly TV";
  const title = `Key Features of ${brand} — Live Sports, Multiple Servers & HD Streaming`;
  const description = `Explore key features of ${brand}. Every sport live in HD, backup servers per match, on-demand replays, ad-free streaming, and zero root required.`;
  const ogImageUrl = "/images/og-matchfly.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/features",
      siteName: brand,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1024,
          height: 576,
          alt: `${brand} Features`,
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

export default async function FeaturesPage() {
  const data = await getSiteData();

  return (
    <main id="top" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header data={data} />

      {/* Hero Section */}
      <section
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "54px 20px 44px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 50px)",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              color: "#0f172a",
              lineHeight: 1.15,
              margin: "0 0 16px 0",
            }}
          >
            Key Features of{" "}
            <span style={{ color: data.accent || "#16a34a" }}>{data.brand}</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              lineHeight: 1.65,
              color: "#475569",
              maxWidth: 680,
              margin: "0 auto 26px",
            }}
          >
            A simple app with everything a{" "}
            <span
              style={{
                background: "#fdf2f8",
                color: "#be185d",
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              ▣ cricket
            </span>{" "}
            or football fan needs to follow the match — and nothing they don&apos;t.
          </p>

          <div>
            <a
              href="/download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: data.accent || "#ff2d8d",
                color: "#ffffff",
                padding: "13px 28px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: `0 6px 18px ${data.accent || "#ff2d8d"}44`,
              }}
            >
              <span>⇩</span> Download Free — {data.app?.version || "v6.4.0"}
            </a>
          </div>
        </div>
      </section>

      {/* 9 Features Grid Container */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 20px 60px" }}>
        <FeaturesGrid accent={data.accent} />

        {/* Bottom CTA Card */}
        <div
          style={{
            marginTop: 48,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: 16,
            padding: "36px clamp(16px, 4vw, 32px)",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px 0" }}>
            Experience {data.brand} Today
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 540, margin: "0 auto 24px" }}>
            Get direct access to HD cricket, football, tennis, and global sports streaming completely free on Android.
          </p>
          <a
            href="/download"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: data.accent || "#16a34a",
              color: "#ffffff",
              padding: "14px 28px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 6px 18px rgba(22, 163, 74, 0.4)",
            }}
          >
            <span>⇩</span> Download APK Free
          </a>
        </div>
      </section>

      <Footer data={data} />
    </main>
  );
}
