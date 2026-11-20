import type { Metadata, Viewport } from "next";
import { getSiteData } from "@/lib/site-data";
// @ts-ignore -- Next.js handles CSS imports; TypeScript does not need a declaration here.
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://matchflytv.com");

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  const brand = data.brand || "Matchfly TV";
  const version = data.app?.version || "v6.4.0";
  const year = new Date().getFullYear();

  const title = `${brand} APK (${version}) Download Latest Version ${year} | Official Website`;
  const description = `${brand} is a free sports streaming app that lets fans worldwide watch live sports in HD — cricket, football, tennis, and more.`;
  const ogImageUrl = "/images/og-matchfly.jpg";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${brand}`,
    },
    description,
    applicationName: brand,
    authors: [{ name: `${brand} Team` }],
    generator: "Next.js",
    keywords: [
      brand,
      `${brand} APK`,
      `${brand} Download`,
      `${brand} Live`,
      "Free Sports Streaming",
      "Live Cricket Streaming",
      "Live Football Streaming",
      "Android Sports APK",
      "HD Sports App",
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: brand,
      title,
      description,
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
      creator: `@${brand.replace(/\s+/g, "")}`,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ff2d8d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1518096220879359"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : 'e67c1ce697b8e207a7458c8f84a9b550',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
              };
            `,
          }}
        />
    
      </head>
      <body>{children}</body>
    </html>
  );
  // jksdljakfl
}
