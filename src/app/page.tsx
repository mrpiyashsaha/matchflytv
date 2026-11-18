import type { Metadata } from "next";
import { getSiteData, type SiteData } from "@/lib/site-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContentRenderer } from "@/components/ContentRenderer";
import { FeaturesGrid } from "@/components/FeaturesGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const brand = data.brand || "Matchfly TV";
  const version = data.app?.version || "v6.4.0";
  const year = new Date().getFullYear();

  const title = `${brand} APK (${version}) Download Latest Version ${year} | Official Website`;
  const description = `${brand} is a free sports streaming app that lets fans worldwide watch live sports in HD — cricket, football, tennis, and more.`;
  const ogImageUrl = "/images/og-matchfly.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/",
      siteName: brand,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1024,
          height: 576,
          alt: `${brand} Live Sports HD Streaming Free Forever`,
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

function AppDetails({ data }: { data: SiteData }) {
  const app = data.app;
  const rows = [
    ["App Name", app.name || data.brand],
    ["Version", app.version],
    ["Size", app.size],
    ["File Type", app.fileType || "APK (.apk)"],
    ["Requirement", app.requirement],
    ["Category", app.category],
    ["Developer", app.developer],
    ["Price", app.price || "Free"],
  ];
  return (
    <section className="app-details section" id="download">
      <h2>{data.brand} App — Details</h2>
      <div className="details-card">
        {rows.map(([label, value]) => (
          <div className="detail-row" key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
      <a className="primary" href="/download">
        ⇩ Download {data.brand} {app.version}
      </a>
    </section>
  );
}

function GallerySection({ data }: { data: SiteData }) {
  const images = data.gallery.length ? data.gallery : [{ url: "/images/matchfly-phone.png", alt: "Matchfly TV live events" }];
  return (
    <section className="gallery">
      <h2>A Closer Look at {data.brand}</h2>
      <p className="sub">Simple, clean and made for watching the match</p>
      <div className="mock-gallery">
        {images.map((image, index) => (
          <div className="screen image-screen" key={`${image.url}-${index}`}>
            <img src={image.url} alt={image.alt || `${data.brand} screenshot ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutAndBanner({ data }: { data: SiteData }) {
  return (
    <>
      <section className="full-banner">
        <img src="/images/matchfly-tv-banner.png" alt={`${data.brand} live sports banner`} />
      </section>
      <section className="about wrap">
        {data.about?.content ? (
          <ContentRenderer content={data.about.content} />
        ) : (
          <>
            <h2>What is {data.brand}?</h2>
            <p>
              <b>{data.brand}</b> is a free Android app made so sports fans never miss a match. It covers cricket, football, tennis, kabaddi, hockey, basketball, boxing and motorsport.
            </p>
            <p>
              {data.brand} brings live streaming links together in one simple app. Every game usually has more than one server, so if a stream slows down you can tap another link and carry on watching in HD, for free.
            </p>
            <h3>How much does {data.brand} cost?</h3>
            <p>Nothing. {data.brand} is completely free — no subscription, no in-app purchases and no card details.</p>
            <h3>Getting started with {data.brand}</h3>
            <p>Download the latest APK and follow the simple Android install guide. Setup takes about a minute.</p>
            <h3>Why fans pick {data.brand}</h3>
            <p>{data.brand} keeps the matches you care about across every sport in one free place.</p>
          </>
        )}
      </section>
    </>
  );
}

export default async function Home() {
  const data = await getSiteData();

  return (
    <main id="top">
      <Header data={data} />
      <section className="hero wrap">
        <div className="hero-copy">
          <p
            className="eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#fdf2f8",
              color: "#be185d",
              border: "1px solid #fbcfe8",
              borderRadius: 30,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              margin: "0 0 16px 0",
            }}
          >
            <span style={{ fontSize: 10 }}>●</span> All Sports Live · Updated Daily
          </p>

          <h1
            style={{
              fontSize: "clamp(38px, 5.5vw, 56px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-1.8px",
              color: "#111827",
              margin: "0 0 18px 0",
            }}
          >
            {data.heroTitle || "Free Live Sports"}
            <br />
            <span style={{ color: data.accent || "#ff2d8d" }}>
              {data.heroHighlight || "on Your Android"}
            </span>
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#52657d", maxWidth: 520, margin: "0 0 24px 0" }}>
            {data.heroDescription ||
              `${data.brand} streams every sport live in HD — from cricket and football to tennis, kabaddi, hockey and more. Daily-updated links and backup servers so you always catch the game. Free, no sign-up.`}{" "}
            <mark
              style={{
                backgroundColor: "#fdf2f8",
                color: "#be185d",
                padding: "2px 8px",
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

          <div className="actions" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
            <a
              className="primary"
              href="/download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 26px",
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 10,
                backgroundColor: data.accent || "#ff2d8d",
                boxShadow: `0 8px 20px ${data.accent || "#ff2d8d"}44`,
              }}
            >
              <span style={{ fontSize: 20 }}>⇩</span>
              <span>Download APK Free</span>
            </a>
            <a
              className="secondary"
              href="/install-guide"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "13px 22px",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#334155",
              }}
            >
              <span>How to Install</span>
              <span>›</span>
            </a>
          </div>

          {/* Metadata Badges row matching reference screenshot */}
          <div className="hero-meta-row">
            <span
              style={{
                backgroundColor: "#f1f5f9",
                color: "#475569",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #e2e8f0",
              }}
            >
              {data.app?.version || "v1.0.0"}
            </span>
            <span
              style={{
                backgroundColor: "#f1f5f9",
                color: "#475569",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #e2e8f0",
              }}
            >
              {data.app?.size || "12.4 MB"}
            </span>
            <span
              style={{
                backgroundColor: "#f1f5f9",
                color: "#475569",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #e2e8f0",
              }}
            >
              {data.app?.requirement || "Android 7.0+"}
            </span>
            <span
              style={{
                backgroundColor: "#f1f5f9",
                color: "#475569",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid #e2e8f0",
              }}
            >
              {data.app?.price || "100% Free"}
            </span>
          </div>
        </div>

        {/* Banner Graphic / Phone */}
        <div className="hero-media">
          <img
            className="hero-banner-img"
            src={data.bannerImage || "/images/matchfly-phone.png"}
            alt={`${data.brand} app preview on Android`}
          />
        </div>
      </section>

      {/* Sports Scroller / Strip below the Banner */}
      <section className="sports-strip">
        <div className="sports-strip-track">
          <span>🏏 Cricket</span>
          <span>⚽ Football</span>
          <span>🏀 Basketball</span>
          <span>🎾 Tennis</span>
          <span>🏎️ Motorsport</span>
          <span>🥊 Boxing</span>
          <span>🏐 Volleyball</span>
          <span>🏒 Hockey</span>
          <span>⛳ Golf</span>
          <span>🏉 Rugby</span>
          <span>🏊 Swimming</span>
          <span>🚴 Cycling</span>
          <span>🏏 Cricket</span>
          <span>⚽ Football</span>
          <span>🏀 Basketball</span>
          <span>🎾 Tennis</span>
          <span>🏎️ Motorsport</span>
          <span>🥊 Boxing</span>
          <span>🏐 Volleyball</span>
          <span>🏒 Hockey</span>
          <span>⛳ Golf</span>
          <span>🏉 Rugby</span>
          <span>🏊 Swimming</span>
          <span>🚴 Cycling</span>
        </div>
      </section>

      <AppDetails data={data} />
      <section className="section" id="features">
        <h2>Why Fans Love {data.brand}</h2>
        <p className="sub">Built around one thing — getting you to the match, fast and free.</p>
        <div style={{ marginTop: 28 }}>
          <FeaturesGrid accent={data.accent} />
        </div>
      </section>
      <GallerySection data={data} />
      <section className="section install" id="install">
        <h2>Get {data.brand} in 3 Easy Steps</h2>
        <p className="sub">No tech skills needed — you will be watching in about a minute.</p>
        <div className="steps">
          {[["01", "Download the APK"], ["02", "Allow Unknown Sources"], ["03", "Install & Watch"]].map(([num, title]) => (
            <article key={num}>
              <b>{num}</b>
              <h3>{title}</h3>
              <p>Follow the instructions and start watching your favourite matches.</p>
            </article>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          <a className="primary" href="/download">
            ⇩ Download {data.brand} APK Now
          </a>
          <a
            className="secondary"
            href="/install-guide"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "13px 22px",
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#334155",
            }}
          >
            <span>Full Step-by-Step Guide</span>
            <span>›</span>
          </a>
        </div>
      </section>
      <section className="sports section">
        <h2>Cricket, Football & Everything Else</h2>
        <p className="sub">From the big final to the local derby — {data.brand} has the match.</p>
        <div className="sport-grid">
          {["🏏 Cricket", "⚽ Football", "🏒 Hockey", "🏀 Basketball", "🎾 Tennis", "🏎️ Motorsport", "🥊 Boxing", "🏐 Volleyball"].map(x => (
            <div key={x}>{x}</div>
          ))}
        </div>
      </section>
      <section className="faq section" id="faq">
        <h2>Frequently Asked Questions</h2>
        <p className="sub">Everything you need to know before downloading</p>
        {["Is the app free to download?", "Is the APK safe to use?", "Which devices does it support?"].map(x => (
          <details key={x}>
            <summary>{x}<span>⌄</span></summary>
            <p>Always download the latest APK from the official website and verify the details above.</p>
          </details>
        ))}
      </section>
      <AboutAndBanner data={data} />
      <section className="final-cta">
        <h2>Catch the Next Match on {data.brand}</h2>
        <p>Download free and join millions of fans streaming live sports.</p>
        <a className="primary" href="/download">
          ⇩ Download {data.brand} APK
        </a>
      </section>
      <Footer data={data} />
    </main>
  );
}
