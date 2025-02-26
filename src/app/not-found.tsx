"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import SplashCursor from "@/lib/blocks/animations/SplashCursor/SplashCursor";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Effect */}
      <SplashCursor
        BACK_COLOR={{ r: 0, g: 0, b: 0 }}
        SPLAT_RADIUS={0.3}
        DENSITY_DISSIPATION={2}
        VELOCITY_DISSIPATION={1.5}
        PRESSURE={0.2}
        PRESSURE_ITERATIONS={25}
        CURL={20}
        SPLAT_FORCE={8000}
      />

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 px-4">
        <h1 className="text-[150px] font-bold text-white leading-none animate-pulse">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-300 max-w-md mx-auto">
            Looks like you've ventured into uncharted territory. The page you're
            looking for seems to have been swept away in the vortex.
          </p>
        </div>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              Return Home
            </Button>
          </Link>
          <Link href="/polls">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              View Polls
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
