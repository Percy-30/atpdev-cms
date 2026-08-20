import { getSiteConfig } from "@atpdev/database";

export async function GET() {
  const config = await getSiteConfig();
  const rawId = config?.adsense_id || "ca-pub-3940256099942544";
  const pubId = rawId.replace(/^ca-/, "");

  const body = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
