import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Social preview image (Facebook, iMessage, WhatsApp, LinkedIn…), rendered
 * once at build time to out/og-image.png. A route rather than the
 * opengraph-image file convention because the export needs a real .png
 * filename for GitHub Pages to serve it as an image. Reads the name from
 * site.ts, so a rename updates it. Attached to every page in src/lib/seo.ts.
 */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0f2350",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="100" height="80" viewBox="0 0 40 32" fill="none">
            <path d="M3 17 L20 4 L37 17" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 4 L20 9" stroke="#7aa3ee" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 20 L8 28 M32 20 L32 28" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>{site.short}</div>
            <div style={{ fontSize: 20, letterSpacing: 6, opacity: 0.7 }}>ROOFING</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            Roofing built for a New England winter.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#bcd0ea" }}>
            Southern NH &amp; Northern MA · Free estimates
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
