"use server";

import { revalidatePath } from "next/cache";
import { updateSiteConfig } from "@atpdev/database";

export async function saveSettings(formData: FormData) {
  const updates: Record<string, string | string[] | boolean> = {};

  // Text fields
  const textFields = [
    'hero_title', 'hero_subtitle', 'primary_color', 'secondary_color',
    'full_name', 'bio_short', 'bio_long', 'avatar_url',
    'email', 'phone', 'location',
    'github_url', 'linkedin_url', 'twitter_url', 'facebook_url',
    'instagram_url', 'youtube_url', 'tiktok_url', 'whatsapp_url',
    'telegram_url', 'discord_url',
    'cv_url', 'credly_url', 'ga4_id', 'adsense_id'
  ];

  for (const field of textFields) {
    const value = formData.get(field);
    if (value !== null) {
      updates[field] = value as string;
    }
  }

  // Boolean toggle fields (checkboxes)
  const toggleFields = [
    'github_enabled', 'linkedin_enabled', 'twitter_enabled', 'facebook_enabled',
    'instagram_enabled', 'youtube_enabled', 'tiktok_enabled', 'whatsapp_enabled',
    'telegram_enabled', 'discord_enabled'
  ];

  for (const field of toggleFields) {
    updates[field] = formData.get(field) === 'on';
  }

  // Typewriter (comma separated)
  const typewriter = formData.get('hero_typewriter') as string;
  if (typewriter) {
    updates['hero_typewriter'] = typewriter.split(',').map(s => s.trim()).filter(Boolean);
  }

  const success = await updateSiteConfig(updates);

  if (success) {
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
  }
}
