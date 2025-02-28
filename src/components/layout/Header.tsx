"use client";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <div className="h-16 fixed inset-y-0 w-full z-50">
      <div className="h-full w-full bg-white/50 backdrop-blur-sm border-b flex items-center justify-between px-4">
        <div className="flex-1 flex items-center gap-x-3 md:justify-center">
          <MobileMenu />
          <p className="text-xl font-semibold text-center">
            ボルテックス ⚡️
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-x-4">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/polls" className="hover:text-gray-600">
                  Polls
                </a>
              </li>
              <li>
                <a href="/create" className="hover:text-gray-600">
                  Create Poll
                </a>
              </li>
              <li>
                <a href="/manage" className="hover:text-gray-600">
                  Manage Poll
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
