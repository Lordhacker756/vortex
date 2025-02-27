"use client";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="h-16 fixed inset-y-0 w-full z-50">
      <div className="h-full w-full bg-white/50 backdrop-blur-sm border-b flex items-center justify-between px-4">
        <div className="flex items-center w-full">
          <p className="text-xl font-semibold text-center w-full">ボルテックス ⚡️</p>
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-sm border-b shadow-lg">
          <nav className="px-4 py-2">
            <ul className="space-y-2">
              <li>
                <a
                  href="/polls"
                  className="block py-2 hover:bg-gray-100 rounded-md px-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Polls
                </a>
              </li>

              <li>
                <a
                  href="/polls/manage"
                  className="block py-2 hover:bg-gray-100 rounded-md px-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Polls
                </a>
              </li>
              <li>
                <a
                  href="/polls/create"
                  className="block py-2 hover:bg-gray-100 rounded-md px-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Poll
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
