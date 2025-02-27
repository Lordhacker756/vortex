"use client";

import { Toaster } from "sonner";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster richColors position="top-center" />
    </>
  );
}
