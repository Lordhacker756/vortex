"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  ListChecks,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const routes = [
  {
    label: "Polls",
    icon: ListChecks,
    href: "/polls",
    color: "text-violet-500",
  },
  {
    label: "Create",
    icon: PlusCircle,
    href: "/polls/new",
    color: "text-pink-700",
  },
  {
    label: "Manage",
    icon: BarChart3,
    href: "/polls/manage",
    color: "text-orange-700",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.clear();

      toast.success("Logged out successfully");
      // Small delay before navigation
      setTimeout(() => {
        router.replace("/login");
      }, 10);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Vortex ⚡️</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Add Logout Button */}
      <div className="px-3 py-2">
        <button
          onClick={handleLogout}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            Logout
          </div>
        </button>
      </div>
    </div>
  );
}
