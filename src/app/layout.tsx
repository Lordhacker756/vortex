'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Vortex ⚡️",
//   description: "Lighting fast real-time voting",

//   // Favicons
//   icons: {
//     icon: [
//       { url: "/favicon.ico" },
//       { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
//       { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
//     ],
//     apple: [{ url: "/apple-touch-icon.png" }],
//     other: [
//       {
//         rel: "mask-icon",
//         url: "/safari-pinned-tab.svg",
//         color: "#5bbad5",
//       },
//     ],
//   },

//   // Manifest
//   manifest: "/site.webmanifest",

//   // Open Graph
//   openGraph: {
//     type: "website",
//     url: "https://vortex-vercel.app",
//     title: "Vortex ⚡️",
//     description: "Lighting fast real-time voting",
//     siteName: "Vortex",
//     images: [
//       {
//         url: "/og-image.png", // Make sure to add your OG image
//         width: 1200,
//         height: 630,
//         alt: "Vortex - Lighting fast real-time voting",
//       },
//     ],
//   },

//   // Twitter
//   twitter: {
//     card: "summary_large_image",
//     title: "Vortex ⚡️",
//     description: "Lighting fast real-time voting",
//     images: ["/og-image.png"],
//     creator: "@yourtwitterhandle", // Optional
//   },

//   // Additional metadata
//   themeColor: "#ffffff",
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: "Vortex",
//   },
//   viewport: {
//     width: "device-width",
//     initialScale: 1,
//     maximumScale: 1,
//   },
//   applicationName: "Vortex",
//   keywords: ["voting", "real-time", "polls", "vortex"],
// };

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
        {children}
      </body>
    </html>
  );
}
