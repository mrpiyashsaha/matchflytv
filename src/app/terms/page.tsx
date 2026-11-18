import { getSiteData } from "@/lib/site-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentRenderer } from "@/components/ContentRenderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  return {
    title: `Terms of Service — ${data.brand}`,
    description: `Read the terms of service for using ${data.brand} website and application.`,
  };
}

export default async function TermsPage() {
  const data = await getSiteData();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
      <Header data={data} />

      <main style={{ flex: 1, padding: "50px 20px 80px 20px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h1
              style={{
                fontSize: "clamp(30px, 4.5vw, 44px)",
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-1px",
                margin: "0 0 12px 0",
              }}
            >
              Terms of Service
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
              Official terms and conditions for {data.brand}
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff" }}>
            <ContentRenderer content={data.termsOfService || ""} />
          </div>
        </div>
      </main>

      <Footer data={data} />
    </div>
  );
}

