import { getSiteData } from "@/lib/site-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentRenderer } from "@/components/ContentRenderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  return {
    title: `Privacy Policy — ${data.brand}`,
    description: `Read the privacy policy for ${data.brand}. Learn how we handle your privacy and data.`,
  };
}

export default async function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} · {data.brand}
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff" }}>
            <ContentRenderer content={data.privacyPolicy || ""} />
          </div>

          {data.contact?.email && (
            <div
              style={{
                marginTop: 48,
                padding: "24px",
                borderRadius: 12,
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0", fontSize: 18, color: "#0f172a" }}>Questions & Contact</h3>
              <p style={{ margin: 0, fontSize: 14, color: "#475569" }}>
                If you have any questions about our privacy practices, contact us at:{" "}
                <a href={`mailto:${data.contact.email}`} style={{ color: data.accent || "#ff2d8d", fontWeight: 600 }}>
                  {data.contact.email}
                </a>
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer data={data} />
    </div>
  );
}
