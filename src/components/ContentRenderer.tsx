import React from "react";

export function ContentRenderer({ content }: { content: string }) {
  if (!content) return null;

  // Split content by double newlines into blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="rendered-page-content">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 1
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} style={{ fontSize: 32, fontWeight: 800, margin: "32px 0 16px 0", letterSpacing: "-0.5px" }}>
              {trimmed.replace(/^#\s+/, "")}
            </h1>
          );
        }

        // Heading 2
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} style={{ fontSize: 24, fontWeight: 800, margin: "28px 0 14px 0", color: "#111827", letterSpacing: "-0.3px" }}>
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} style={{ fontSize: 19, fontWeight: 700, margin: "24px 0 10px 0", color: "#1e293b" }}>
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        // Bullet list
        if (trimmed.split("\n").every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))) {
          const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s+/, ""));
          return (
            <ul key={idx} style={{ paddingLeft: 22, margin: "0 0 18px 0", lineHeight: 1.8, color: "#475569" }}>
              {items.map((it, i) => (
                <li key={i}>{formatInline(it)}</li>
              ))}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} style={{ fontSize: 16, lineHeight: 1.85, color: "#374151", margin: "0 0 18px 0" }}>
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function formatInline(text: string): React.ReactNode[] {
  // Regex to match **bold**, [badge], or special keywords
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[mark:[^\]]+\]|Live TV app|Android app)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(<strong key={match.index} style={{ color: "#0f172a" }}>{token.slice(2, -2)}</strong>);
    } else if (token === "Live TV app") {
      parts.push(
        <mark
          key={match.index}
          style={{
            backgroundColor: "#dcfce7",
            color: "#15803d",
            padding: "2px 8px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            display: "inline-block",
            marginLeft: 3,
            marginRight: 3,
          }}
        >
          ▣ Live TV app
        </mark>
      );
    } else if (token === "Android app") {
      parts.push(
        <mark
          key={match.index}
          style={{
            backgroundColor: "#e0e7ff",
            color: "#3730a3",
            padding: "2px 8px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            display: "inline-block",
            marginLeft: 3,
            marginRight: 3,
          }}
        >
          📱 Android app
        </mark>
      );
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

