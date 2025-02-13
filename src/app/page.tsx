import TextPressure from "@/lib/blocks/text/TextPressure/TextPressure";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-[100vh] w-full flex items-center justify-center">
      <TextPressure text="Vortex" minFontSize={300} />
    </div>
  );
}
