import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://zataus.com"),
  title: "Zataus",
  description:
    "Zataus is a modern storefront built for a polished direct-to-consumer experience and future Shopify integration.",
  openGraph: {
    title: "Zataus",
    description:
      "A refined Next.js storefront starter for zataus.com with room to grow into a headless Shopify experience.",
    url: "https://zataus.com",
    siteName: "Zataus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zataus",
    description:
      "A refined Next.js storefront starter for zataus.com with room to grow into a headless Shopify experience.",
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
