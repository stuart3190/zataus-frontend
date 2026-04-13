import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Zataus",
  description:
    "Zataus is a premium one-product storefront powered by Shopify Storefront API data.",
  openGraph: {
    title: "Zataus",
    description:
      "A refined Next.js storefront for zataus.com with live Shopify product data, premium presentation, and direct cart handoff.",
    url: siteUrl,
    siteName: "Zataus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zataus",
    description:
      "A refined Next.js storefront for zataus.com with live Shopify product data and direct Shopify checkout flow.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
