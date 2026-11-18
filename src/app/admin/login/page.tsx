"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = "/admin";
      } else {
        const data = await response.json();
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0b0f19",
        padding: 20,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#161d2d",
          borderRadius: 16,
          padding: 32,
          border: "1px solid #1e293b",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 50,
              height: 50,
              margin: "0 auto 12px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #ff2d8d, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 24,
              color: "#fff",
              boxShadow: "0 4px 14px rgba(255, 45, 141, 0.4)",
            }}
          >
            M
          </div>
          <h1 style={{ margin: "0 0 6px 0", fontSize: 22, fontWeight: 800, color: "#f8fafc" }}>
            Matchfly<span style={{ color: "#ff2d8d" }}>TV</span>
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Sign in to access the control panel</p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#fca5a5",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#94a3b8",
                letterSpacing: "0.5px",
                marginBottom: 6,
              }}
            >
              Email Address
            </label>
            <input
              type="text"
              placeholder="admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: 14,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#94a3b8",
                letterSpacing: "0.5px",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: 14,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#ff2d8d",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(255, 45, 141, 0.35)",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign in to Dashboard →"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <a
            href="/"
            style={{
              color: "#64748b",
              fontSize: 12,
              textDecoration: "none",
            }}
          >
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
