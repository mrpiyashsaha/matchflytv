"use client";

import { useState } from "react";
import type { SiteData } from "@/lib/site-data";
import { getDownloadHref } from "@/lib/download-url";

export { getDownloadHref };

export function Header({ data }: { data: SiteData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const downloadHref = getDownloadHref(data);

  // Format brand into parts if contains "TV" or word split
  const brandParts = (data.brand || "Matchfly TV").split(" ");
  const mainName = brandParts[0] || "Matchfly";
  const suffix = brandParts.slice(1).join(" ") || "TV";

  return (
    <>
      <div className="notice">
        ◉ Official {data.brand} — download only from the official website.
      </div>
      <header className="site-header">
        <a className="logo" href="/">
          {mainName}
          <span>{suffix.length <= 3 ? "" : suffix}</span>
          <b>{suffix.length <= 3 ? suffix : "TV"}</b>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="/">Home</a>
          <a href="/features">Features</a>
          <a href="/install-guide">Install Guide</a>
          <a href="/#faq">FAQ</a>
          <a href="/about">About</a>
        </nav>

        <div className="header-actions">
          <button
            className="mode"
            type="button"
            aria-label="Toggle dark mode"
            onClick={() => {
              document.documentElement.classList.toggle("dark");
            }}
          >
            ☾
          </button>
          <a className="download" href={downloadHref}>
            ⇩ Download APK
          </a>
          <button
            className="mobile-menu-btn"
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <a href="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </a>
          <a href="/features" onClick={() => setMobileMenuOpen(false)}>
            Features
          </a>
          <a href="/install-guide" onClick={() => setMobileMenuOpen(false)}>
            Install Guide
          </a>
          <a href="/#faq" onClick={() => setMobileMenuOpen(false)}>
            FAQ
          </a>
          <a href="/about" onClick={() => setMobileMenuOpen(false)}>
            About Us
          </a>
          <a
            href={downloadHref}
            className="mobile-drawer-download"
            onClick={() => setMobileMenuOpen(false)}
          >
            ⇩ Download {data.brand} APK Free
          </a>
        </div>
      )}
    </>
  );
}
