import { NextResponse } from "next/server";
import { getSubdomainConfig } from "@atpdev/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const config = getSubdomainConfig("sorteos");
  return NextResponse.json({
    success: true,
    theme: config.theme,
    branding: config.branding,
    updated_at: config.updated_at,
  });
}
