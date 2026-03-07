import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voeez.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "voeez – Voice to Text für macOS",
    template: "%s – voeez",
  },
  description:
    "Blitzschnelle Spracherkennung direkt auf deinem Mac. Diktiere, transkribiere und übersetze – mit KI-Power. 7 Tage kostenlos testen.",
  keywords: [
    "voice to text",
    "Diktiersoftware",
    "Spracherkennung Mac",
    "macOS Diktat",
    "Transkription",
    "KI Diktat",
    "voeez",
  ],
  authors: [{ name: "voeez" }],
  creator: "voeez",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "voeez",
    title: "voeez – Voice to Text für macOS",
    description:
      "Blitzschnelle Spracherkennung direkt auf deinem Mac. 7 Tage kostenlos testen.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "voeez – Voice to Text für macOS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "voeez – Voice to Text für macOS",
    description:
      "Blitzschnelle Spracherkennung direkt auf deinem Mac. 7 Tage kostenlos testen.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
