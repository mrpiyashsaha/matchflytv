import type { SiteData } from "@/lib/site-data";
import { getDownloadHref } from "@/lib/download-url";

export function Footer({ data }: { data: SiteData }) {
  const downloadHref = getDownloadHref(data);

  const brandParts = (data.brand || "Matchfly TV").split(" ");
  const mainName = brandParts[0] || "Matchfly";
  const suffix = brandParts.slice(1).join(" ") || "TV";

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <b className="logo">
            {mainName}
            <span>{suffix.length <= 3 ? "" : suffix}</span>
            <b>{suffix.length <= 3 ? suffix : "TV"}</b>
          </b>
          <p>
            Watch live sports free on your Android device.
            <br />
            Cricket, football, hockey and more. <mark>▣ Live TV app</mark>
          </p>
          <a className="footer-download" href={downloadHref}>
            ⇩ Download {data.app?.version || "APK"}
          </a>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href={downloadHref}>Download APK</a>
          <a href="/install-guide">Install on Android</a>
          <a href="/install-guide#tv">Install on TV / Fire TV</a>
          <a href="/install-guide#pc">Install on PC</a>
          <a href="/install-guide#ios">Install on iPhone</a>
          <a href="/#faq">FAQ</a>
        </div>

        <div className="footer-column">
          <h3>Legal & Info</h3>
          <a href="/about">About Us</a>
          <a href={downloadHref}>Official App (Avoid Fakes)</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          {data.customPages?.map((page) => (
            <a key={page.slug} href={`/${page.slug}`}>
              {page.title}
            </a>
          ))}
          <a href={`mailto:${data.contact?.email || "support@matchfly.tv"}`}>Contact Us</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          {data.brand} is an independent application and is not affiliated with, endorsed by, or connected to any sports broadcaster, league, or rights holder. This app aggregates publicly available streams for personal use. All trademarks belong to their respective owners.
        </p>
        <small>© {new Date().getFullYear()} {data.brand} · All rights reserved</small>
      </div>
    </footer>
  );
}
