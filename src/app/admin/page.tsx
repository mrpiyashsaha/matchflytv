import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import SettingsForm from "./settings-form";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #ff2d8d, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 18,
              color: "#fff",
              boxShadow: "0 2px 10px rgba(255, 45, 141, 0.4)",
            }}
          >
            M
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px", display: "flex", alignItems: "center", gap: 8 }}>
              Matchfly<span style={{ color: "#ff2d8d" }}>TV</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "2px 7px",
                  borderRadius: 20,
                  backgroundColor: "rgba(255, 45, 141, 0.2)",
                  color: "#ff80bf",
                  border: "1px solid rgba(255, 45, 141, 0.4)",
                  letterSpacing: "0.5px",
                }}
              >
                Control Panel
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Manage live site, APK uploads & settings</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 8,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#e2e8f0",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              transition: "all 0.2s",
            }}
          >
            <span>🌐 View Public Site</span>
            <span style={{ fontSize: 11 }}>↗</span>
          </a>

          <form action="/api/admin/logout" method="POST" style={{ margin: 0 }}>
            <button
              type="submit"
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#fca5a5",
                fontSize: 13,
                fontWeight: 600,
                border: "1px solid rgba(239, 68, 68, 0.3)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>🚪 Sign out</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 20px 60px 20px" }}>
        <SettingsForm />
      </main>
    </div>
  );
}
