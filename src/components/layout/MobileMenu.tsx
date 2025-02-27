import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
  const username = localStorage.getItem("username");

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
          <div className="px-4 py-6 border-t mt-4">
            <p className="text-xs text-gray-400 mb-2">
              Signed in as <span className="font-medium">{username}</span>
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
