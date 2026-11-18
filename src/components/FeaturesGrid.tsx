import { keyFeatures, type FeatureItem } from "@/lib/site-data";

export function FeatureIcon({ iconKey, accent }: { iconKey: FeatureItem["iconKey"]; accent?: string }) {
  const color = accent || "#ff2d8d";

  switch (iconKey) {
    case "video":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 8-6 4 6 4V8Z" />
          <rect width="14" height="12" x="2" y="6" rx="2" />
        </svg>
      );
    case "grid":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1.5" />
          <rect width="7" height="7" x="14" y="3" rx="1.5" />
          <rect width="7" height="7" x="14" y="14" rx="1.5" />
          <rect width="7" height="7" x="3" y="14" rx="1.5" />
        </svg>
      );
    case "film":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 3v18" />
          <path d="M3 7.5h4" />
          <path d="M3 12h18" />
          <path d="M3 16.5h4" />
          <path d="M17 3v18" />
          <path d="M17 7.5h4" />
          <path d="M17 16.5h4" />
        </svg>
      );
    case "refresh":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      );
    case "play":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" fill={color} stroke="none" />
        </svg>
      );
    case "bell":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "search":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "shield-ban":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.9 4.9 14.2 14.2" />
        </svg>
      );
    case "shield-check":
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

export function FeaturesGrid({ accent }: { accent?: string }) {
  return (
    <div className="features-grid">
      {keyFeatures.map((item) => (
        <div key={item.title} className="feature-card">
          {/* Icon Badge */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#fdf2f8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <FeatureIcon iconKey={item.iconKey} accent={accent} />
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.4px",
              margin: "0 0 10px 0",
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.65,
              color: "#475569",
              margin: 0,
            }}
          >
            {item.text}
          </p>

          {/* Optional Pill Tag */}
          {item.badge && (
            <div style={{ marginTop: 14 }}>
              <span
                style={{
                  background: "#fdf2f8",
                  color: "#be185d",
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12,
                  display: "inline-block",
                }}
              >
                ▣ {item.badge}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
