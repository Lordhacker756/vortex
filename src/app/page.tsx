import Waves from "@/lib/blocks/backgrounds/Waves/Waves";
import BlurText from "@/lib/blocks/text/BlurText/BlurText";
import TextPressure from "@/lib/blocks/text/TextPressure/TextPressure";
import Button from "@/lib/globals/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full flex items-center justify-center flex-col">
      <Waves
        lineColor="gray"
        backgroundColor="rgba(255, 255, 255, 0.0)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center px-4">
        <div className="hidden md:block">
          <TextPressure textColor="black" text="Vortex" minFontSize={400} />
        </div>
        <div className="md:hidden">
          <TextPressure textColor="black" text="Vortex" minFontSize={150} />
        </div>

        <BlurText
          text="Experience Real Time Voting"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[4rem] text-center"
        />

        <button className="bg-black text-white px-4 py-2 rounded-lg mt-4 hover:scale-105 transition-transform duration-200 w-full max-w-xs md:max-w-md">
          <Link href="/register" className="w-full block">
            <p className="font-semibold text-base md:text-lg text-white text-center">
              Let's get started ⚡️
            </p>
          </Link>
        </button>
      </div>
    </div>
  );
}
