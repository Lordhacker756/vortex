"use client";

import { Button } from "@/components/ui/button";
import { getAuthToken, removeAuthToken } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const isAuthenticated = !!getAuthToken();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      removeAuthToken();
      localStorage.removeItem("userId");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          {isAuthenticated && (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
