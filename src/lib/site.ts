const DEFAULT_SITE_URL = "https://zataus.com";

export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    return DEFAULT_SITE_URL;
  }

  const normalized = value.startsWith("http") ? value : `https://${value}`;

  try {
    return new URL(normalized).toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}
