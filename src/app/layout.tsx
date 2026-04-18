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
    "Portable car air purifier for vans and cars, designed for dust and pollen during spring driving.",
  openGraph: {
    title: "Zataus",
    description:
      "Portable car air purifier for vans and cars, designed for dust and pollen during spring driving.",
    url: siteUrl,
    siteName: "Zataus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zataus",
    description:
      "Portable car air purifier for vans and cars, designed for dust and pollen during spring driving.",
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
