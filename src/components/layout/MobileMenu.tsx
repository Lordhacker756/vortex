import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { label: "All Polls", href: "/polls", icon: "📊" },
  { label: "My Polls", href: "/polls/manage", icon: "📝" },
  { label: "Create Poll", href: "/polls/new", icon: "➕" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    // Add logout functionality here
    console.log("Logging out...");
    localStorage.clear();
    window.location.href = "/login";
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="py-8 w-[280px] max-w-[80vw]">
        <div className="flex flex-col h-full">
          <div className="px-2 mb-8">
            <h2 className="text-2xl font-bold">Vortex ⚡️</h2>
            <p className="text-sm text-gray-500 mt-1">
              Real-time voting platform
            </p>
          </div>
          <nav className="space-y-1 px-2 flex-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center py-3 px-4 rounded-md hover:bg-gray-100 transition-colors",
                  pathname === item.href && "bg-gray-100 font-medium"
                )}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="px-2 mt-auto pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
