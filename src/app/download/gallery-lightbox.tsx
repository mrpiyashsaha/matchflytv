"use client";

import { useState } from "react";

export function GalleryLightbox({
  images,
  brand,
}: {
  images: { url: string; alt: string }[];
  brand: string;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const displayImages = images.length
    ? images
    : [{ url: "/images/matchfly-phone.png", alt: `${brand} screenshot` }];

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 18,
          overflowX: "auto",
          padding: "16px 20px 24px 20px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          justifyContent: "flex-start",
        }}
      >
        {displayImages.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            onClick={() => setSelectedImage(image.url)}
            style={{
              flex: "0 0 min(245px, 75vw)",
              height: "clamp(380px, 65vh, 510px)",
              borderRadius: 36,
              overflow: "hidden",
              border: "7px solid #0b0f19",
              backgroundColor: "#0b0f19",
              boxShadow: "0 18px 40px rgba(11, 15, 25, 0.22)",
              cursor: "pointer",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              scrollSnapAlign: "center",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 22px 48px rgba(11, 15, 25, 0.32)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 18px 40px rgba(11, 15, 25, 0.22)";
            }}
          >
            {/* Phone Front Camera Dot for realistic phone mockup */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: "#000000",
                zIndex: 10,
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            />

            <img
              src={image.url}
              alt={image.alt || `${brand} screenshot ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 6, fontWeight: 500 }}>
        Tap any screenshot to enlarge
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(11, 15, 25, 0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
            cursor: "zoom-out",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "92vh" }}>
            <img
              src={selectedImage}
              alt="Enlarged screenshot"
              style={{
                maxWidth: "100%",
                maxHeight: "88vh",
                borderRadius: 24,
                boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                display: "block",
                margin: "0 auto",
                border: "4px solid #1e293b",
              }}
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: -14,
                right: -14,
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                border: "none",
                fontSize: 18,
                fontWeight: "bold",
                color: "#0f172a",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
