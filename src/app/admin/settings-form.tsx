"use client";

import { useEffect, useState } from "react";
import type { CustomPage } from "@/lib/site-data";

type Values = Record<string, string>;

type TabKey = "apk" | "brand" | "pages" | "gallery" | "contact";

const appFields = [
  { key: "name", label: "App Name", placeholder: "Matchfly TV", help: "The public name of the application" },
  { key: "version", label: "App Version", placeholder: "v1.0.0", help: "Displayed on the download buttons" },
  { key: "size", label: "File Size", placeholder: "14.5 MB", help: "Auto-set on APK upload or custom text" },
  { key: "fileType", label: "File Type", placeholder: "APK (.apk)", help: "Default: APK (.apk)" },
  { key: "requirement", label: "Minimum Android OS", placeholder: "Android 7.0+", help: "Device compatibility requirement" },
  { key: "category", label: "Category", placeholder: "Sports · Live TV", help: "Play Store or app category" },
  { key: "developer", label: "Developer Name", placeholder: "Matchfly Team", help: "App creator or organization" },
  { key: "price", label: "Price / License", placeholder: "Free", help: "e.g. Free or Free / No Ads" },
];

export default function SettingsForm() {
  const [activeTab, setActiveTab] = useState<TabKey>("pages");
  const [pageSubTab, setPageSubTab] = useState<"about" | "privacy" | "terms" | "custom">("about");
  const [data, setData] = useState<Values>({});
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsOfService, setTermsOfService] = useState("");
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gallery, setGallery] = useState<{ url: string; alt: string }[]>([]);
  const [uploadingApk, setUploadingApk] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const showMsg = (text: string, type: "success" | "error" | "info" = "info") => {
    setMessage({ text, type });
  };

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings", { cache: "no-store" });
      const value = await response.json();
      setData({ ...value, ...(value.app || {}), ...(value.contact || {}) });
      setAboutTitle(value.about?.title || "");
      setAboutSubtitle(value.about?.subtitle || "");
      setAboutContent(value.about?.content || "");
      setPrivacyPolicy(value.privacyPolicy || "");
      setTermsOfService(value.termsOfService || "");
      setCustomPages(value.customPages || []);
      setGallery(value.gallery || []);
    } catch {
      showMsg("Could not load settings from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const set = (key: string, value: string) => setData((current) => ({ ...current, [key]: value }));

  const save = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setSaving(true);
    showMsg("Saving settings...", "info");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          brand: data.brand,
          tagline: data.tagline,
          accent: data.accent,
          heroTitle: data.heroTitle,
          heroHighlight: data.heroHighlight,
          heroDescription: data.heroDescription,
          bannerImage: data.bannerImage || "",
          apkUrl: data.apkUrl,
          apkUrl2: data.apkUrl2 || "",
          apkUrl3: data.apkUrl3 || "",
          about: {
            title: aboutTitle,
            subtitle: aboutSubtitle,
            content: aboutContent,
          },
          privacyPolicy,
          termsOfService,
          customPages,
          app: Object.fromEntries(appFields.map((f) => [f.key, data[f.key] || ""])),
          contact: {
            email: data.email || "",
            whatsapp: data.whatsapp || "",
          },
          gallery,
        }),
      });

      if (response.ok) {
        showMsg("Settings and pages saved successfully!", "success");
      } else {
        const result = await response.json();
        showMsg(result.error || "Save failed. Please check inputs.", "error");
      }
    } catch (err) {
      showMsg("Network error: " + (err instanceof Error ? err.message : "Save failed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const uploadApk = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".apk")) {
      showMsg("Please select a valid .apk file", "error");
      event.target.value = "";
      return;
    }

    setUploadingApk(true);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    showMsg(`Uploading APK (${sizeMb} MB)... Please wait.`, "info");

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/admin/apk", {
        method: "POST",
        body: form,
      });
      const result = await response.json();

      if (!response.ok) {
        showMsg(result.error || "APK upload failed", "error");
        return;
      }

      setData((current) => ({
        ...current,
        apkUrl: result.url,
        size: result.size || current.size,
        fileType: "APK (.apk)",
      }));
      showMsg(`✓ APK uploaded successfully: ${result.filename} (${result.size})`, "success");
    } catch (err) {
      showMsg("APK upload failed: " + (err instanceof Error ? err.message : "Network error"), "error");
    } finally {
      setUploadingApk(false);
      event.target.value = "";
    }
  };

  const optimizeImageForUpload = async (file: File): Promise<File | Blob> => {
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      return file;
    }
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxDim = 1920;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        if (file.size <= 1.5 * 1024 * 1024 && width === img.width && height === img.height) {
          resolve(file);
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const cleanName = file.name.replace(/\.[^.]+$/, outputType === "image/png" ? ".png" : ".jpg");
              resolve(new File([blob], cleanName, { type: outputType }));
            } else {
              resolve(file);
            }
          },
          outputType,
          0.9
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  };

  const uploadGallery = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadingGallery(true);
    showMsg(`Uploading ${files.length} screenshot${files.length === 1 ? "" : "s"}...`, "info");
    const uploaded: { url: string; alt: string }[] = [];

    try {
      for (const file of files) {
        const fileToUpload = await optimizeImageForUpload(file);
        const form = new FormData();
        form.append("file", fileToUpload);
        const response = await fetch("/api/admin/gallery", { method: "POST", body: form });

        const rawText = await response.text();
        let result: any = null;
        try {
          result = rawText ? JSON.parse(rawText) : null;
        } catch {
          result = null;
        }

        if (!response.ok) {
          if (response.status === 401) {
            showMsg("Your admin session expired. Please log in again.", "error");
            setTimeout(() => { window.location.href = "/admin/login"; }, 1500);
            return;
          }
          const errorMsg = result?.error || rawText || `Server error (HTTP ${response.status})`;
          showMsg(errorMsg, "error");
          return;
        }

        if (result?.url) {
          uploaded.push({ url: result.url, alt: result.alt || file.name });
        }
      }

      if (uploaded.length > 0) {
        setGallery((current) => {
          const next = [...current, ...uploaded];
          // Auto-save to database immediately so images are preserved
          fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gallery: next }),
          }).catch(() => {});
          return next;
        });
        showMsg(`✓ ${uploaded.length} screenshot${uploaded.length === 1 ? "" : "s"} uploaded and saved successfully!`, "success");
      }
    } catch (err) {
      showMsg("Gallery upload failed: " + (err instanceof Error ? err.message : "Network error"), "error");
    } finally {
      setUploadingGallery(false);
      event.target.value = "";
    }
  };

  const addCustomPage = () => {
    const newPage: CustomPage = {
      slug: `page-${customPages.length + 1}`,
      title: "New Custom Page",
      subtitle: "Page subtitle description here",
      content: `## Section Title\n\nWrite your page content here...`,
    };
    setCustomPages([...customPages, newPage]);
    setPageSubTab("custom");
  };

  const updateCustomPage = (index: number, updated: Partial<CustomPage>) => {
    setCustomPages((curr) => {
      const copy = [...curr];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const removeCustomPage = (index: number) => {
    if (!window.confirm("Delete this custom page?")) return;
    setCustomPages((curr) => curr.filter((_, i) => i !== index));
  };

  const removeDefaults = async () => {
    if (!window.confirm("Are you sure you want to restore all defaults? Any custom settings will be cleared.")) return;
    try {
      const response = await fetch("/api/admin/settings", { method: "DELETE" });
      if (response.ok) {
        showMsg("Settings restored to defaults", "success");
        await load();
      } else {
        const result = await response.json();
        showMsg(result.error || "Delete failed", "error");
      }
    } catch {
      showMsg("Could not reset settings", "error");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>Loading admin settings...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Toast / Message Banner */}
      {message && (
        <div
          style={{
            marginBottom: 20,
            padding: "14px 18px",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
            fontWeight: 500,
            backgroundColor:
              message.type === "success" ? "#ecfdf5" : message.type === "error" ? "#fef2f2" : "#eff6ff",
            color:
              message.type === "success" ? "#065f46" : message.type === "error" ? "#991b1b" : "#1e40af",
            border: `1px solid ${
              message.type === "success" ? "#a7f3d0" : message.type === "error" ? "#fecaca" : "#bfdbfe"
            }`,
            boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>{message.type === "success" ? "✅" : message.type === "error" ? "⚠️" : "ℹ️"}</span>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
              padding: "0 4px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Modern Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: 4,
          flexWrap: "wrap",
        }}
      >
        {[
          { key: "pages", label: "Pages & Content (/about, /privacy, etc.)", icon: "📄" },
          { key: "apk", label: "APK & Download", icon: "📦" },
          { key: "brand", label: "Brand & Hero", icon: "🎨" },
          { key: "gallery", label: "Screenshots Gallery", icon: "🖼️", count: gallery.length },
          { key: "contact", label: "Contact Info", icon: "📞" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                borderRadius: "10px 10px 0 0",
                border: "none",
                borderBottom: isActive ? "3px solid #ff2d8d" : "3px solid transparent",
                backgroundColor: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#0f172a" : "#64748b",
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: isActive ? "0 -2px 6px rgba(0,0,0,0.02)" : "none",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  style={{
                    backgroundColor: isActive ? "#ff2d8d" : "#e2e8f0",
                    color: isActive ? "#ffffff" : "#475569",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={save}>
        {/* TAB: PAGES & CONTENT */}
        {activeTab === "pages" && (
          <div style={{ display: "grid", gap: 20 }}>
            {/* Sub-tab Switcher for Pages */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { key: "about", label: "About Us (/about)", icon: "ℹ️" },
                  { key: "privacy", label: "Privacy Policy (/privacy)", icon: "🔒" },
                  { key: "terms", label: "Terms of Service (/terms)", icon: "📜" },
                  { key: "custom", label: `Custom Pages (${customPages.length})`, icon: "➕" },
                ].map((st) => {
                  const isCur = pageSubTab === st.key;
                  return (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setPageSubTab(st.key as any)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid",
                        borderColor: isCur ? "#ff2d8d" : "#cbd5e1",
                        backgroundColor: isCur ? "rgba(255, 45, 141, 0.08)" : "#f8fafc",
                        color: isCur ? "#ff2d8d" : "#475569",
                        fontWeight: isCur ? 700 : 500,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {st.icon} {st.label}
                    </button>
                  );
                })}
              </div>

              {pageSubTab === "custom" && (
                <button
                  type="button"
                  onClick={addCustomPage}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  ➕ Add New Page
                </button>
              )}
            </div>

            {/* Sub-tab 1: About Us Page */}
            {pageSubTab === "about" && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ margin: "0 0 4px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                      ℹ️ About Us Page (/about)
                    </h2>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                      This content is displayed on the dedicated <strong>/about</strong> page and home page about section with full Header & Footer.
                    </p>
                  </div>
                  <a
                    href="/about"
                    target="_blank"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      backgroundColor: "#f1f5f9",
                      color: "#2563eb",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    👁️ View /about Page ↗
                  </a>
                </div>

                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                      Page Title
                    </label>
                    <input
                      type="text"
                      placeholder="About Matchfly TV"
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                      Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="One free app for live sports — every match you don't want to miss."
                      value={aboutSubtitle}
                      onChange={(e) => setAboutSubtitle(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                      Page Content (Headings & Paragraphs)
                    </label>
                    <textarea
                      rows={12}
                      placeholder={`## What is Matchfly TV?\n\nMatchfly TV is a free Android app for sports fans...`}
                      value={aboutContent}
                      onChange={(e) => setAboutContent(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box", fontFamily: "monospace", lineHeight: 1.6 }}
                    />
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                      Tip: Use <code>## Section Title</code> for headings. Words like <code>Live TV app</code> and <code>Android app</code> get styled badges automatically.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Privacy Policy */}
            {pageSubTab === "privacy" && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ margin: "0 0 4px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                      🔒 Privacy Policy Page (/privacy)
                    </h2>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                      Displayed on <strong>/privacy</strong> with complete site Header & Footer.
                    </p>
                  </div>
                  <a
                    href="/privacy"
                    target="_blank"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      backgroundColor: "#f1f5f9",
                      color: "#2563eb",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    👁️ View /privacy Page ↗
                  </a>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                    Privacy Policy Text
                  </label>
                  <textarea
                    rows={14}
                    placeholder="Matchfly TV respects your privacy..."
                    value={privacyPolicy}
                    onChange={(e) => setPrivacyPolicy(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box", fontFamily: "monospace", lineHeight: 1.6 }}
                  />
                </div>
              </div>
            )}

            {/* Sub-tab 3: Terms of Service */}
            {pageSubTab === "terms" && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ margin: "0 0 4px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                      📜 Terms of Service Page (/terms)
                    </h2>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                      Displayed on <strong>/terms</strong> with complete site Header & Footer.
                    </p>
                  </div>
                  <a
                    href="/terms"
                    target="_blank"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      backgroundColor: "#f1f5f9",
                      color: "#2563eb",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    👁️ View /terms Page ↗
                  </a>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                    Terms of Service Text
                  </label>
                  <textarea
                    rows={14}
                    placeholder="Welcome to Matchfly TV. By using our application..."
                    value={termsOfService}
                    onChange={(e) => setTermsOfService(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box", fontFamily: "monospace", lineHeight: 1.6 }}
                  />
                </div>
              </div>
            )}

            {/* Sub-tab 4: Custom Pages List */}
            {pageSubTab === "custom" && (
              <div style={{ display: "grid", gap: 18 }}>
                {customPages.length === 0 ? (
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px dashed #e2e8f0",
                      borderRadius: 14,
                      padding: "48px 20px",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "#334155" }}>No custom pages created yet</div>
                    <div style={{ fontSize: 13, margin: "6px 0 16px 0" }}>
                      You can add custom pages like DMCA Notice, Disclaimer, or FAQ with their own URL and Header/Footer.
                    </div>
                    <button
                      type="button"
                      onClick={addCustomPage}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#0f172a",
                        color: "#ffffff",
                        borderRadius: 8,
                        border: "none",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      ➕ Create First Custom Page
                    </button>
                  </div>
                ) : (
                  customPages.map((page, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 14,
                        padding: "24px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                          Custom Page #{index + 1}: {page.title || "Untitled"}
                        </h3>
                        <div style={{ display: "flex", gap: 8 }}>
                          <a
                            href={`/${page.slug}`}
                            target="_blank"
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              backgroundColor: "#f1f5f9",
                              color: "#2563eb",
                              fontSize: 12,
                              fontWeight: 600,
                              textDecoration: "none",
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            👁️ View /{page.slug} ↗
                          </a>
                          <button
                            type="button"
                            onClick={() => removeCustomPage(index)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              backgroundColor: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            ✕ Delete
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 4 }}>
                            Page Title
                          </label>
                          <input
                            type="text"
                            value={page.title}
                            onChange={(e) => updateCustomPage(index, { title: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 4 }}>
                            URL Slug (e.g. dmca, disclaimer)
                          </label>
                          <input
                            type="text"
                            value={page.slug}
                            onChange={(e) =>
                              updateCustomPage(index, {
                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""),
                              })
                            }
                            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                          />
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 4 }}>
                            Subtitle Description
                          </label>
                          <input
                            type="text"
                            value={page.subtitle || ""}
                            onChange={(e) => updateCustomPage(index, { subtitle: e.target.value })}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }}
                          />
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 4 }}>
                            Page Body Content
                          </label>
                          <textarea
                            rows={8}
                            value={page.content}
                            onChange={(e) => updateCustomPage(index, { content: e.target.value })}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box", fontFamily: "monospace" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APK & DOWNLOAD */}
        {activeTab === "apk" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div>
                  <h2 style={{ margin: "0 0 6px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                    📥 Android APK File Upload
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                    Upload your latest APK file. The client website will automatically serve this file to users across all download buttons.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <a
                    href="/download"
                    target="_blank"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      backgroundColor: "#f1f5f9",
                      color: "#2563eb",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    👁️ View /download Page ↗
                  </a>
                  {data.apkUrl && data.apkUrl !== "#download" ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        backgroundColor: "#ecfdf5",
                        color: "#059669",
                        padding: "6px 14px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      ● APK Active
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        backgroundColor: "#fffbeb",
                        color: "#b45309",
                        padding: "6px 14px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        border: "1px solid #fde68a",
                      }}
                    >
                      ○ No APK Configured
                    </span>
                  )}
                </div>
              </div>

              {/* Direct APK Download Link / Worker URL Input */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "18px 20px",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#1e293b" }}>
                    🔗 Direct APK Download URL / Worker Link (Auto-Download)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      set("apkUrl", "https://mathfly.app-host-55d.workers.dev/");
                      set("size", "11.2 MB");
                      showMsg("Worker link set! Click 'Save All Settings' below to apply.", "info");
                    }}
                    style={{
                      background: "#fdf2f8",
                      color: "#be185d",
                      border: "1px solid #fbcfe8",
                      borderRadius: 6,
                      padding: "5px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ⚡ Use Worker Link (mathfly.workers.dev)
                  </button>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="https://mathfly.app-host-55d.workers.dev/"
                    value={data.apkUrl || ""}
                    onChange={(e) => set("apkUrl", e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 14,
                      boxSizing: "border-box",
                      fontFamily: "monospace",
                    }}
                  />
                  {data.apkUrl && data.apkUrl !== "#download" && (
                    <a
                      href="/api/download"
                      target="_blank"
                      download
                      style={{
                        padding: "11px 18px",
                        backgroundColor: "#ff2d8d",
                        color: "#ffffff",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 6px rgba(255, 45, 141, 0.25)",
                      }}
                    >
                      ⇩ Test Download
                    </a>
                  )}
                </div>

                <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                  Paste your Cloudflare Worker URL or direct APK link here (e.g. <code>https://mathfly.app-host-55d.workers.dev/</code>). When users click <strong>Download APK</strong> anywhere on the website, it will automatically download this file.
                </p>
              </div>

              {/* OR Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "18px 0" }}>
                <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                  OR Upload APK File From Computer
                </span>
                <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
              </div>

              <div
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: 12,
                  padding: "26px",
                  backgroundColor: "#f8fafc",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>📲</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 4 }}>
                  Select or drop your APK file here
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
                  Supported formats: <strong>.apk</strong> (Up to 250 MB)
                </div>
                <label
                  style={{
                    display: "inline-block",
                    padding: "10px 22px",
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: uploadingApk ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 6px rgba(15, 23, 42, 0.2)",
                  }}
                >
                  {uploadingApk ? "⏳ Uploading APK... Please wait" : "📂 Choose APK File"}
                  <input
                    type="file"
                    accept=".apk,application/vnd.android.package-archive"
                    onChange={uploadApk}
                    disabled={uploadingApk}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {data.apkUrl && data.apkUrl !== "#download" && (
                <div
                  style={{
                    marginTop: 18,
                    padding: "14px 18px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.5px" }}>
                      Current File URL
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", wordBreak: "break-all" }}>
                      {data.apkUrl}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {data.size && (
                      <span
                        style={{
                          backgroundColor: "#e2e8f0",
                          color: "#334155",
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {data.size}
                      </span>
                    )}
                    <a
                      href="/api/download"
                      target="_blank"
                      download
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#16a34a",
                        color: "#ffffff",
                        borderRadius: 6,
                        textDecoration: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>⇩ Test Download</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <h2 style={{ margin: "0 0 18px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                ⚙️ App Details & Specs
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                {appFields.map((field) => (
                  <div key={field.key}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#475569",
                        letterSpacing: "0.5px",
                        marginBottom: 6,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={data[field.key] || ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        fontSize: 14,
                        color: "#0f172a",
                        backgroundColor: "#ffffff",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{field.help}</div>
                  </div>
                ))}

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#475569",
                      letterSpacing: "0.5px",
                      marginBottom: 6,
                    }}
                  >
                    Primary Download URL (Auto-set on upload or custom link)
                  </label>
                  <input
                    type="text"
                    placeholder="/uploads/apks/... or https://..."
                    value={data.apkUrl || ""}
                    onChange={(e) => set("apkUrl", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 14,
                      color: "#0f172a",
                      backgroundColor: "#ffffff",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#475569",
                      letterSpacing: "0.5px",
                      marginBottom: 6,
                    }}
                  >
                    Alternative Download Link 2 (Mirror 2)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or /uploads/..."
                    value={data.apkUrl2 || ""}
                    onChange={(e) => set("apkUrl2", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 14,
                      color: "#0f172a",
                      backgroundColor: "#ffffff",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                    Displayed as "Download Link 2" on the /download page.
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#475569",
                      letterSpacing: "0.5px",
                      marginBottom: 6,
                    }}
                  >
                    Alternative Download Link 3 (Mirror 3)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or /uploads/..."
                    value={data.apkUrl3 || ""}
                    onChange={(e) => set("apkUrl3", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 14,
                      color: "#0f172a",
                      backgroundColor: "#ffffff",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                    Displayed as "Download Link 3" on the /download page.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BRAND & HERO */}
        {activeTab === "brand" && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <h2 style={{ margin: "0 0 18px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              🎨 Brand & Hero Section
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  Brand Name
                </label>
                <input
                  type="text"
                  placeholder="Matchfly TV"
                  value={data.brand || ""}
                  onChange={(e) => set("brand", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="Live sports. HD streaming. Free forever."
                  value={data.tagline || ""}
                  onChange={(e) => set("tagline", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  Accent Color
                </label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type="color"
                    value={data.accent?.startsWith("#") ? data.accent : "#ff2d8d"}
                    onChange={(e) => set("accent", e.target.value)}
                    style={{ width: 44, height: 42, padding: 2, borderRadius: 8, border: "1px solid #cbd5e1", cursor: "pointer" }}
                  />
                  <input
                    type="text"
                    placeholder="#ff2d8d"
                    value={data.accent || ""}
                    onChange={(e) => set("accent", e.target.value)}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  Hero Headline
                </label>
                <input
                  type="text"
                  placeholder="Free Live Sports"
                  value={data.heroTitle || ""}
                  onChange={(e) => set("heroTitle", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  Hero Highlight Word / Phrase (Accent Colored)
                </label>
                <input
                  type="text"
                  placeholder="on Your Android"
                  value={data.heroHighlight || ""}
                  onChange={(e) => set("heroHighlight", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  Hero Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Matchfly TV brings every match closer — cricket, football, tennis..."
                  value={data.heroDescription || ""}
                  onChange={(e) => set("heroDescription", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box", resize: "vertical" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  Hero Banner Graphic / Phone Image
                </label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="/images/matchfly-phone.png"
                    value={data.bannerImage || ""}
                    onChange={(e) => set("bannerImage", e.target.value)}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                  />
                  <button
                    type="button"
                    onClick={() => set("bannerImage", "/images/matchfly-phone.png")}
                    style={{
                      padding: "10px 16px",
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Reset to Default Image
                  </button>
                </div>
                <small style={{ color: "#64748b", marginTop: 4, display: "block" }}>
                  Default is <code>/images/matchfly-phone.png</code>.
                </small>
              </div>
            </div>
          </div>
        )}

        {/* TAB: APP GALLERY */}
        {activeTab === "gallery" && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: "0 0 6px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                  🖼️ App Screenshots Gallery
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  Upload screenshots displayed in the “A Closer Look” section on the home page.
                </p>
              </div>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  backgroundColor: "#ff2d8d",
                  color: "#ffffff",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: uploadingGallery ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(255, 45, 141, 0.3)",
                }}
              >
                <span>{uploadingGallery ? "⏳ Uploading..." : "➕ Upload Screenshots"}</span>
                <input
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg,.webp,.gif"
                  multiple
                  onChange={uploadGallery}
                  disabled={uploadingGallery}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {gallery.length === 0 ? (
              <div
                style={{
                  border: "2px dashed #e2e8f0",
                  borderRadius: 12,
                  padding: "48px 20px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>No screenshots uploaded yet</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Default mockup image is shown on the website.</div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 16,
                }}
              >
                {gallery.map((image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    style={{
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#0f172a",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Screenshot ${index + 1}`}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1.35",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div style={{ position: "absolute", top: 8, right: 8 }}>
                      <button
                        type="button"
                        onClick={() => setGallery((curr) => curr.filter((_, i) => i !== index))}
                        style={{
                          backgroundColor: "rgba(239, 68, 68, 0.9)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 6,
                          padding: "4px 8px",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.75)",
                        color: "#f8fafc",
                        fontSize: 11,
                        padding: "4px 8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      #{index + 1} {image.alt || "Screenshot"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: CONTACT */}
        {activeTab === "contact" && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <h2 style={{ margin: "0 0 18px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              📞 Contact Information
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  Support Email
                </label>
                <input
                  type="email"
                  placeholder="support@matchfly.tv"
                  value={data.email || ""}
                  onChange={(e) => set("email", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                  WhatsApp / Phone
                </label>
                <input
                  type="text"
                  placeholder="+880 1700 000000"
                  value={data.whatsapp || ""}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Bar Footer */}
        <div
          style={{
            marginTop: 28,
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "12px 28px",
                backgroundColor: "#ff2d8d",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(255, 45, 141, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{saving ? "⏳ Saving..." : "💾 Save Changes"}</span>
            </button>

            <button
              type="button"
              onClick={() => void load()}
              style={{
                padding: "12px 20px",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              ↻ Reload
            </button>
          </div>

          <button
            type="button"
            onClick={() => void removeDefaults()}
            style={{
              padding: "10px 16px",
              backgroundColor: "transparent",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            🗑️ Restore Defaults
          </button>
        </div>
      </form>
    </div>
  );
}
