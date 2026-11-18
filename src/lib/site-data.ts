export type CustomPage = {
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
};

export type SiteData = {
  brand: string;
  tagline: string;
  accent: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  bannerImage?: string;
  apkUrl: string;
  apkUrl2?: string;
  apkUrl3?: string;
  app: {
    name?: string;
    version: string;
    size: string;
    fileType?: string;
    requirement: string;
    developer: string;
    category: string;
    price?: string;
  };
  contact: { email: string; whatsapp: string };
  privacyPolicy: string;
  termsOfService: string;
  about: {
    title: string;
    subtitle: string;
    content: string;
  };
  customPages: CustomPage[];
  gallery: { url: string; alt: string }[];
};

export const defaultAbout = {
  title: "About Matchfly TV",
  subtitle: "One free app for live sports — every match you don't want to miss.",
  content: `## What is Matchfly TV?

Matchfly TV is a free Android app for sports fans. It covers all sports — cricket, football, tennis, kabaddi, hockey, basketball, boxing and motorsport — with cricket and football the most watched. It doesn't broadcast its own channels; instead it gathers live streaming links that are already available on the internet and lays them out in one tidy app, so you can find a match and start watching in seconds. No Play Store account, no sign-up, no monthly bill.

## Why we built it

Following your team shouldn't mean juggling subscriptions and a dozen apps. We built Matchfly TV so fans have one reliable, simple place to catch the game — whether it's the World Cup final or a weekday league clash.

## How much does Matchfly TV cost?

Nothing. Matchfly TV is completely free — no subscription, no in-app purchases and no card details.

## Getting started with Matchfly TV

Download the latest APK and follow the simple Android install guide. Setup takes about a minute.

## Why fans pick Matchfly TV

Matchfly TV keeps the matches you care about across every sport in one free place.`,
};

export const defaultTerms = `## Terms of Service for Matchfly TV

Welcome to Matchfly TV. By using our website and application, you agree to comply with and be bound by the following terms and conditions.

## 1. Acceptance of Terms
By downloading, installing, or using Matchfly TV, you agree to these Terms of Service. If you do not agree with any part of these terms, please do not use the application or website.

## 2. Disclaimer & Content Notice
Matchfly TV is an independent application that aggregates publicly available live streaming links on the internet. Matchfly TV does not host, upload, or broadcast any media or copyright content directly. All streams and broadcasts are provided by external third-party servers.

## 3. Fair Use & Trademarks
All trademarks, logos, team names, and brand names are the property of their respective owners. Their mention on this website and app is solely for informational purposes and does not imply endorsement or affiliation.

## 4. Updates & Changes
We reserve the right to modify these terms at any time without prior notice.`;

export const defaultPrivacy = `## Privacy Policy for Matchfly TV

Matchfly TV respects your privacy. We do not sell personal information or require an account to browse the website or download the APK.

## 1. Information Collection
We do not require users to create an account or provide personal details to use our application. No personal credentials, emails, or phone numbers are requested for streaming.

## 2. Third-Party Links
Our application may contain links to external streaming sources that are publicly available on the internet. We do not host or broadcast any media content directly, and we do not track your browsing activity outside our application.

## 3. Security
We implement reasonable security measures to maintain the safety and integrity of our application and website.

## 4. Contact Us
If you have any questions about this Privacy Policy, please contact our support team.`;

export const siteData: SiteData = {
  brand: "Matchfly TV",
  tagline: "Live sports. HD streaming. Free forever.",
  accent: "#ff2d8d",
  heroTitle: "Free Live Sports",
  heroHighlight: "on Your Android",
  heroDescription:
    "Matchfly TV streams every sport live in HD — from cricket and football to tennis, kabaddi, hockey and more. Daily-updated links and backup servers so you always catch the game. Free, no sign-up.",
  bannerImage: "/images/matchfly-phone.png",
  apkUrl: "#download",
  apkUrl2: "",
  apkUrl3: "",
  app: {
    version: "v1.0.0",
    size: "12.4 MB",
    requirement: "Android 7.0+",
    developer: "Matchfly Team",
    category: "Sports · Live TV",
    fileType: "APK (.apk)",
    price: "Free",
  },
  contact: { email: "support@matchfly.tv", whatsapp: "+880 1700 000000" },
  privacyPolicy: defaultPrivacy,
  termsOfService: defaultTerms,
  about: defaultAbout,
  customPages: [],
  gallery: [],
};

export function sanitizeSiteData(raw: any): SiteData {
  if (!raw) return siteData;

  const app = raw.app || {};
  const contact = raw.contact || {};
  const about = raw.about || {};

  const cleanGallery: { url: string; alt: string }[] = Array.isArray(raw.gallery)
    ? raw.gallery
        .filter((item: any) => item && typeof item.url === "string" && item.url.trim().length > 0)
        .map((item: any) => ({
          url: String(item.url),
          alt: String(item.alt || ""),
        }))
    : [];

  const cleanCustomPages: CustomPage[] = Array.isArray(raw.customPages)
    ? raw.customPages
        .filter((p: any) => p && typeof p.slug === "string" && typeof p.title === "string")
        .map((p: any) => ({
          slug: String(p.slug),
          title: String(p.title),
          subtitle: p.subtitle ? String(p.subtitle) : "",
          content: p.content ? String(p.content) : "",
        }))
    : [];

  return {
    brand: String(raw.brand || siteData.brand),
    tagline: String(raw.tagline || siteData.tagline),
    accent: String(raw.accent || siteData.accent),
    heroTitle: String(raw.heroTitle || siteData.heroTitle),
    heroHighlight: String(raw.heroHighlight || siteData.heroHighlight),
    heroDescription: String(raw.heroDescription || siteData.heroDescription),
    bannerImage: String(raw.bannerImage || siteData.bannerImage || "/images/matchfly-phone.png"),
    apkUrl: String(raw.apkUrl || siteData.apkUrl),
    apkUrl2: raw.apkUrl2 ? String(raw.apkUrl2) : "",
    apkUrl3: raw.apkUrl3 ? String(raw.apkUrl3) : "",
    app: {
      name: String(app.name || raw.brand || siteData.app.name || "Matchfly TV"),
      version: String(app.version || siteData.app.version),
      size: String(app.size || siteData.app.size),
      fileType: String(app.fileType || siteData.app.fileType || "APK (.apk)"),
      requirement: String(app.requirement || siteData.app.requirement),
      developer: String(app.developer || siteData.app.developer),
      category: String(app.category || siteData.app.category),
      price: String(app.price || siteData.app.price || "Free"),
    },
    contact: {
      email: String(contact.email || siteData.contact.email),
      whatsapp: String(contact.whatsapp || siteData.contact.whatsapp),
    },
    privacyPolicy: String(raw.privacyPolicy || defaultPrivacy),
    termsOfService: String(raw.termsOfService || defaultTerms),
    about: {
      title: String(about.title || defaultAbout.title),
      subtitle: String(about.subtitle || defaultAbout.subtitle),
      content: String(about.content || defaultAbout.content),
    },
    customPages: cleanCustomPages,
    gallery: cleanGallery,
  };
}

export async function getSiteData(): Promise<SiteData> {
  try {
    const { connectDb } = await import("@/lib/db");
    const { SiteSettingsModel } = await import("@/lib/models/site-settings");
    await connectDb();
    const saved = (await SiteSettingsModel.findOne({ key: "main" }).lean()) as any;

    if (!saved) return siteData;

    return sanitizeSiteData(saved);
  } catch {
    return siteData;
  }
}

export type FeatureItem = {
  iconKey: "video" | "grid" | "film" | "refresh" | "play" | "bell" | "search" | "shield-ban" | "shield-check";
  title: string;
  badge?: string;
  text: string;
};

export const keyFeatures: FeatureItem[] = [
  {
    iconKey: "video",
    title: "Every Sport, Live",
    badge: "Live TV app",
    text: "Cricket, football, tennis, kabaddi, hockey, basketball, boxing and motorsport — all live in HD. Cricket and football lead, but every sport is covered.",
  },
  {
    iconKey: "grid",
    title: "Multiple Servers Per Match",
    text: "Big games come with several stream links. If one slows down, switch to a backup and keep watching without missing the action.",
  },
  {
    iconKey: "film",
    title: "Highlights & Replays",
    text: "Missed kick-off or the first ball? Catch up with on-demand replays and highlights of the games you couldn't watch live.",
  },
  {
    iconKey: "refresh",
    title: "Daily-Updated Links",
    text: "Every stream link and channel is checked and refreshed each day, so the app keeps working reliably through busy match schedules.",
  },
  {
    iconKey: "play",
    title: "Smooth HD Player",
    text: "A lightweight built-in player streams cleanly up to Full HD and stays stable even on older, modest phones.",
  },
  {
    iconKey: "bell",
    title: "Match Notifications",
    text: "Get alerts for upcoming matches and start times, so you never miss kick-off or the first ball of a game you care about.",
  },
  {
    iconKey: "search",
    title: "Quick Match Search",
    text: "Type a team, league or sport and jump straight to it — no endless scrolling to find your stream.",
  },
  {
    iconKey: "shield-ban",
    title: "Ad-Free Streaming",
    text: "No pop-ups or mid-stream ad breaks while you watch — the live stream plays uninterrupted from start to finish.",
  },
  {
    iconKey: "shield-check",
    title: "No Root Needed",
    text: "Runs on any standard Android phone or device — no rooting, no special permissions and nothing technical to configure.",
  },
];

export const features = [
  ["◉", "Every Sport, Live", "Cricket, football, tennis, kabaddi, hockey, basketball, motorsport and more — every match in HD."],
  ["◈", "Multiple Stream Servers", "Every match carries several backup links. If one server slows down, switch to another."],
  ["▦", "Highlights & Replays", "Could not watch live? Catch up with on-demand replays and highlights of the matches you missed."],
  ["↻", "Daily-Updated Links", "Our team checks and refreshes every stream link and channel each day."],
  ["▷", "Smooth HD Playback", "A lightweight built-in player delivers clear, stable streaming on most phones."],
  ["$", "Always Free", "No subscription, no card, no hidden fees. Matchfly TV stays free for every fan."],
];
