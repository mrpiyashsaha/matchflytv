import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const brand = data.brand || "Matchfly TV";
  const title = `Install ${brand} APK — Easy 2-Minute Step-by-Step Android Guide`;
  const description = `A quick, no-fuss walkthrough to get ${brand} running on any Android phone or tablet. No root, no Play Store. Free live sports in HD.`;
  const ogImageUrl = "/images/og-matchfly.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/install-guide",
      siteName: brand,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1024,
          height: 576,
          alt: `Install ${brand} APK Guide`,
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

export default async function InstallGuidePage() {
  const data = await getSiteData();
  const brandClean = (data.brand || "Matchfly TV").toLowerCase().replace(/[^a-z0-9]/g, "");
  const apkFileName = `${brandClean}.apk`;

  return (
    <main id="top" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header data={data} />

      {/* Hero Section */}
      <section
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "54px 20px 48px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fdf2f8",
              color: "#be185d",
              fontSize: 13,
              fontWeight: 700,
              padding: "5px 14px",
              borderRadius: 999,
              margin: "0 0 16px 0",
            }}
          >
            <span>⚡</span> Easy Install · 2 Minutes
          </p>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              color: "#0f172a",
              lineHeight: 1.15,
              margin: "0 0 16px 0",
            }}
          >
            Install <span style={{ color: data.accent || "#ff2d8d" }}>{data.brand}</span> APK
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              lineHeight: 1.65,
              color: "#475569",
              maxWidth: 680,
              margin: "0 auto 24px",
            }}
          >
            A quick, no-fuss walkthrough to get {data.brand} running on any Android phone or tablet,
            so you can start streaming live sports. No root, no Play Store required.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <a
              href="/download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: data.accent || "#ff2d8d",
                color: "#ffffff",
                padding: "13px 26px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 6px 18px rgba(255, 45, 141, 0.28)",
              }}
            >
              <span>⇩</span> Download APK First
            </a>
            <a
              href="#steps"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#f1f5f9",
                color: "#334155",
                padding: "13px 22px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid #cbd5e1",
              }}
            >
              Follow Steps <span>↓</span>
            </a>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
              v{data.app?.version || "6.4.0"}
            </span>
            <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
              {data.app?.size || "11.2 MB"}
            </span>
            <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
              Android 7.0+
            </span>
            <span style={{ background: "#fdf2f8", color: "#be185d", padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>
              ✓ 100% Free
            </span>
          </div>
        </div>
      </section>

      {/* Main Steps Container */}
      <section id="steps" style={{ maxWidth: 860, margin: "0 auto", padding: "48px 20px" }}>
        {/* Step 1 */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "clamp(20px, 4vw, 32px)",
            marginBottom: 28,
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span
              style={{
                background: data.accent || "#ff2d8d",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 800,
                padding: "4px 12px",
                borderRadius: 999,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Step 1
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Download the {data.brand} APK
            </h2>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 18px 0" }}>
            Tap the green <strong>Download APK Free</strong> button on our{" "}
            <a href="/download" style={{ color: data.accent || "#ff2d8d", fontWeight: 700 }}>
              download page
            </a>
            . Your browser will save the <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#0f172a", fontWeight: 600 }}>{apkFileName}</code> file to your device Downloads folder.
          </p>

          <div style={{ marginBottom: 20 }}>
            <a
              href="/download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: data.accent || "#ff2d8d",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <span>⇩</span> Go to Download Page
            </a>
          </div>

          {/* Tip Callout */}
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>💡</span>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "#92400e" }}>
              <strong style={{ color: "#78350f" }}>Tip:</strong> If your browser warns{" "}
              <em>&quot;this type of file can harm your device&quot;</em> — tap{" "}
              <strong style={{ color: "#78350f" }}>Download anyway</strong>. This is a standard Google Chrome & Android warning for any APK file downloaded outside the Play Store, not a virus alert.
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "clamp(20px, 4vw, 32px)",
            marginBottom: 28,
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span
              style={{
                background: data.accent || "#ff2d8d",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 800,
                padding: "4px 12px",
                borderRadius: 999,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Step 2
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Enable &quot;Install Unknown Apps&quot;
            </h2>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 20px 0" }}>
            Because {data.brand} is not hosted on the Play Store, Android requires you to allow installation from unknown sources. This is a one-time security permission per browser app.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {/* Android 8+ */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>📱</span>
                <strong style={{ fontSize: 16, color: "#0f172a" }}>Android 8+ (Oreo to Android 15)</strong>
              </div>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: "#475569",
                }}
              >
                <li>Open device <strong>Settings</strong></li>
                <li>Go to <strong>Apps</strong> → select your browser (Chrome/Firefox/Samsung)</li>
                <li>Tap <strong>Install unknown apps</strong></li>
                <li>Toggle <strong>Allow from this source</strong> to <strong style={{ color: "#ff2d8d" }}>ON</strong></li>
              </ol>
            </div>

            {/* Android 6-7 */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>📱</span>
                <strong style={{ fontSize: 16, color: "#0f172a" }}>Android 6–7 (Marshmallow / Nougat)</strong>
              </div>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: "#475569",
                }}
              >
                <li>Open device <strong>Settings</strong></li>
                <li>Go to <strong>Security</strong> (or Lock Screen &amp; Security)</li>
                <li>Find and enable <strong>Unknown sources</strong></li>
                <li>Tap <strong>OK</strong> on the warning prompt</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "clamp(20px, 4vw, 32px)",
            marginBottom: 28,
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span
              style={{
                background: data.accent || "#ff2d8d",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 800,
                padding: "4px 12px",
                borderRadius: 999,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Step 3
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Open and Install the APK
            </h2>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 20px 0" }}>
            Go to your Downloads folder using your file manager or notification panel. Tap <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#0f172a", fontWeight: 600 }}>{apkFileName}</code> to begin installation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                num: "1",
                text: "Tap the APK file in your Downloads folder or tap the download completed notification.",
              },
              {
                num: "2",
                text: "Android will show the app permissions dialog — tap Install.",
              },
              {
                num: "3",
                text: "Wait for installation to complete (usually takes only 10–20 seconds).",
              },
              {
                num: "4",
                text: `Tap Open — ${data.brand} launches instantly and loads all live matches and sports streams.`,
              },
            ].map((st) => (
              <div
                key={st.num}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "14px 18px",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: data.accent || "#ff2d8d",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {st.num}
                </div>
                <div style={{ fontSize: 15, color: "#1e293b", fontWeight: 500, lineHeight: 1.5 }}>
                  {st.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4 */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "clamp(20px, 4vw, 32px)",
            marginBottom: 36,
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span
              style={{
                background: data.accent || "#ff2d8d",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 800,
                padding: "4px 12px",
                borderRadius: 999,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Step 4
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Start Watching Live Sports!
            </h2>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 20px 0" }}>
            {data.brand} opens directly to live matches. No account, no credit card, and no sign-up required. Browse by sport category or use the search bar to find your match.
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Cricket", "Football", "Hockey", "Basketball", "Tennis", "Kabaddi", "Motorsport", "Boxing"].map(
              (sport) => (
                <span
                  key={sport}
                  style={{
                    background: "#f1f5f9",
                    color: "#334155",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  ⚽ {sport}
                </span>
              )
            )}
          </div>
        </div>

        {/* Other Devices Section */}
        <div
          id="tv"
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "clamp(20px, 4vw, 32px)",
            marginBottom: 36,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
            Using a TV or Computer?
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 24px 0" }}>
            We have separate step-by-step guides for those devices:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {/* TV */}
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "20px",
                background: "#f8fafc",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>📺</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                Android TV / Fire TV
              </h3>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 12px 0" }}>
                Install the <strong>Downloader</strong> app from your TV App Store, enter our website URL, download the APK, and install it on your TV.
              </p>
              <a
                href="/download"
                style={{ fontSize: 13, fontWeight: 700, color: data.accent || "#ff2d8d", textDecoration: "none" }}
              >
                Get TV APK ↗
              </a>
            </div>

            {/* PC */}
            <div
              id="pc"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "20px",
                background: "#f8fafc",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>💻</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                PC / Laptop (Emulator)
              </h3>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 12px 0" }}>
                Download <strong>BlueStacks</strong> or <strong>LDPlayer</strong> on your Windows PC or Mac. Drag and drop the {data.brand} APK to stream on your big screen.
              </p>
              <a
                href="/download"
                style={{ fontSize: 13, fontWeight: 700, color: data.accent || "#ff2d8d", textDecoration: "none" }}
              >
                Download for PC ↗
              </a>
            </div>

            {/* iPhone */}
            <div
              id="ios"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "20px",
                background: "#f8fafc",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>🍏</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                {data.brand} for iPhone
              </h3>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 12px 0" }}>
                {data.brand} is currently dedicated to Android APK. iPhone users can access match streaming through our website or mirror from Android.
              </p>
              <a
                href="/"
                style={{ fontSize: 13, fontWeight: 700, color: data.accent || "#ff2d8d", textDecoration: "none" }}
              >
                Learn More ↗
              </a>
            </div>
          </div>
        </div>

        {/* In-depth FAQ / Safety */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "clamp(20px, 4vw, 32px)",
            marginBottom: 36,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 20px 0" }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                Installing the {data.brand} APK on Android
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                Setting up {data.brand} on an Android phone or tablet is quick — usually about a minute — and there&apos;s no rooting or Play Store involved. Since {data.brand} comes as an APK file, you just download it here, give your browser one-time permission to install apps, and tap the file like you would any normal app. The download is small ({data.app?.size || "11.2 MB"}) and works on Android 7.0+ and above, so even older phones handle it fine.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                Is the {data.brand} APK safe?
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                <strong>Yes.</strong> {data.brand} is free of malware, and the &quot;unknown apps&quot; or Play Protect prompts you may see are just Android&apos;s standard security messages for any app installed from outside the Play Store — not a virus alert.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                Why isn&apos;t {data.brand} on the Play Store?
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                Google&apos;s rules keep most live-sports streaming apps off the Play Store, so we offer {data.brand} as a direct download instead. Installing an APK from the official site is a normal, safe way to get the app.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                Will I need to root my phone?
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                <strong>Not at all.</strong> {data.brand} runs on a completely standard Android device — no rooting, no special permissions and nothing technical to configure.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "clamp(20px, 4vw, 32px)",
            marginBottom: 36,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 20px 0" }}>
            Troubleshooting
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                border: "1px solid #fee2e2",
                background: "#fef2f2",
                borderRadius: 12,
                padding: "18px",
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#991b1b", margin: "0 0 6px 0" }}>
                &quot;Parse error&quot; or &quot;App not installed&quot;
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#7f1d1d", margin: 0 }}>
                The APK may be corrupted mid-download or storage is full. Delete the file and re-download from our{" "}
                <a href="/download" style={{ color: "#991b1b", fontWeight: 700, textDecoration: "underline" }}>
                  download page
                </a>
                .
              </p>
            </div>

            <div
              style={{
                border: "1px solid #fef3c7",
                background: "#fffbeb",
                borderRadius: 12,
                padding: "18px",
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#92400e", margin: "0 0 6px 0" }}>
                &quot;Blocked by Play Protect&quot;
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#78350f", margin: 0 }}>
                Tap <strong>More details → Install anyway</strong>. {data.brand} is safe — Play Protect flags all sideloaded APKs by default.
              </p>
            </div>

            <div
              style={{
                border: "1px solid #e0e7ff",
                background: "#eef2ff",
                borderRadius: 12,
                padding: "18px",
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#3730a3", margin: "0 0 6px 0" }}>
                Streams not loading
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#312e81", margin: 0 }}>
                Check your internet connection. Try switching between WiFi and mobile data. Some streams require a stable 4G/5G or broadband connection.
              </p>
            </div>

            <div
              style={{
                border: "1px solid #f1f5f9",
                background: "#f8fafc",
                borderRadius: 12,
                padding: "18px",
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 6px 0" }}>
                App crashes on open
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#475569", margin: 0 }}>
                Force stop the app, clear app cache from <strong>Settings → Apps → {data.brand} → Clear Cache</strong>, then reopen.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              padding: "14px 18px",
              borderRadius: 10,
              background: "#f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 14, color: "#475569" }}>
              Still having issues installing or watching?
            </span>
            <a
              href={`mailto:${data.contact?.email || "support@matchfly.tv"}`}
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: data.accent || "#ff2d8d",
                textDecoration: "none",
              }}
            >
              Contact Support →
            </a>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: 16,
            padding: "36px 32px",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px 0" }}>
            Ready to Stream Live Sports?
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 540, margin: "0 auto 24px" }}>
            Watch live cricket, football, hockey and more free on your Android device. No sign-up required.
          </p>
          <a
            href="/download"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: data.accent || "#ff2d8d",
              color: "#ffffff",
              padding: "14px 28px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 6px 18px rgba(255, 45, 141, 0.4)",
            }}
          >
            <span>⇩</span> Download {data.app?.version || "v6.4.0"} Free
          </a>
        </div>
      </section>

      <Footer data={data} />
    </main>
  );
}

