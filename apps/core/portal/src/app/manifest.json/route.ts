import { getSiteConfig } from "@atpdev/database";
import { NextResponse } from "next/server";

export async function GET() {
  const config = await getSiteConfig();

  const manifest = {
    name: config?.full_name || "ATP Dev",
    short_name: config?.full_name?.split(" ")[0] || "ATP Dev",
    description: config?.bio_short || "Portafolio y aplicaciones por ATP Dev",
    start_url: "/",
    display: "standalone",
    background_color: config?.theme_mode === "dark" ? "#0A0A0A" : "#F9FAFB",
    theme_color: config?.primary_color || "#0052FF",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/avatar.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      }
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
