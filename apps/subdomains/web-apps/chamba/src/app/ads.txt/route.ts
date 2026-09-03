import { NextResponse } from 'next/server';

export async function GET() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'pub-0000000000000000';
  const cleanPubId = pubId.replace('ca-', '');

  const adsTxtContent = `# Google AdSense ads.txt for chamba pro (empleos.atpdev.dev)
google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0
`;

  return new NextResponse(adsTxtContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
