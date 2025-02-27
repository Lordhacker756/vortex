import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://votx.vercel.app"),
  title: "Vortex",
  description: "Lighting fast real-time voting",

  // Favicons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  // Open Graph
  openGraph: {
    type: "website",
    url: "https://votx.vercel.app",
    title: "Vortex ⚡️",
    description: "Lighting fast real-time voting",
    siteName: "Vortex",
    images: [
      {
        url: "/og-image.png", // Make sure to add your OG image
        width: 1200,
        height: 630,
        alt: "Vortex - Lighting fast real-time voting",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Vortex ⚡️",
    description: "Lighting fast real-time voting",
    images: ["/og-image.png"],
    creator: "@rudraksx", // Optional
  },

  // Additional metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vortex",
  },
  applicationName: "Vortex",
  keywords: ["voting", "real-time", "polls", "vortex"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
