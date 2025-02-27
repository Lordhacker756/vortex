"use client";
import { MobileMenu } from "./MobileMenu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-white/80 backdrop-blur-md z-10 px-4">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center">
          <MobileMenu />
          <div className="ml-4 text-lg font-semibold">Vortex ⚡️</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-500"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
