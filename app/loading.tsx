import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0A0A] pointer-events-none">
      <div className="text-center flex flex-col items-center animate-pulse">
        <div className="relative w-[350px] h-[350px] md:w-[700px] md:h-[700px] mb-6 mx-auto flex-shrink-0">
          <Image 
            src="/images/hobbits-wood-logo.svg" 
            alt="Hobbits Wood Logo" 
            fill 
            className="object-contain drop-shadow-2xl" 
            priority 
          />
        </div>
        <div className="w-16 h-1 bg-brand-gold mx-auto mb-8" />
        <Loader2 className="w-5 h-5 text-[#FAFAF7]/50 animate-spin" />
      </div>
    </div>
  );
}
