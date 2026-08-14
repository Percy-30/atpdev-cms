import { getSiteConfig } from "@atpdev/database";

export async function GET() {
  const config = await getSiteConfig();
  
  if (!config?.adsense_id) {
    return new Response("No AdSense ID configured.", { status: 404 });
  }

  // Remove the 'ca-' prefix if it exists to form the correct pub-XXXXXXXX format
  const pubId = config.adsense_id.replace(/^ca-/, '');
  
  const adsTxt = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

  return new Response(adsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
