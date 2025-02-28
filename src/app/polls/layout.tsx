"use client";

import { Geist } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
});

export default function PollsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        <Header />
        <div className="min-h-screen md:pt-8 pt-16 px-4 max-w-7xl mx-auto flex flex-col">
          <div className="flex-grow">
            {children}
            <Toaster richColors position="top-center" closeButton />
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
