import { getSiteData } from "@/lib/site-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentRenderer } from "@/components/ContentRenderer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSiteData();
  const page = data.customPages?.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

  if (!page) {
    return { title: `Page Not Found — ${data.brand}` };
  }

  return {
    title: `${page.title} — ${data.brand}`,
    description: page.subtitle || `${page.title} page for ${data.brand}`,
  };
}

export default async function CustomDynamicPage({ params }: Props) {
  const { slug } = await params;
  const data = await getSiteData();
  const page = data.customPages?.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

  if (!page) {
    notFound();
  }

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
              {page.title}
            </h1>
            {page.subtitle && (
              <p style={{ fontSize: 17, color: "#64748b", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
                {page.subtitle}
              </p>
            )}
          </div>

          <div style={{ backgroundColor: "#ffffff" }}>
            <ContentRenderer content={page.content || ""} />
          </div>
        </div>
      </main>

      <Footer data={data} />
    </div>
  );
}

