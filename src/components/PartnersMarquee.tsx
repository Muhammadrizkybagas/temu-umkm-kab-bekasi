"use client";

import Image from "next/image";

const partners = [
  { name: "Aeon Mall", src: "/partners/aeon.svg" },
  { name: "Alfamart", src: "/partners/alfamart.svg" },
  { name: "Alfamidi", src: "/partners/alfamidi.svg" },
  { name: "Hypermart", src: "/partners/hypermart.svg" },
  { name: "IKEA", src: "/partners/ikea.svg" },
  { name: "Indogrosir", src: "/partners/indogrosir.svg" },
  { name: "Indomaret", src: "/partners/indomaret.svg" },
  { name: "Living World", src: "/partners/living-world.svg" },
  { name: "Papaya", src: "/partners/papaya.svg" },
];

export default function PartnersMarquee() {
  return (
    <div className="w-full">
        
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          Telah Bermitra & Terintegrasi Dengan Jaringan Ritel Terkemuka
        </p>
      </div>


      <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_64px,black_calc(100%-64px),transparent_100%)]">
        <div className="animate-marquee flex items-center gap-16 py-4">
            
          {partners.map((partner, index) => (
            <div
              key={`partner-1-${index}`}
              className="flex items-center justify-center min-w-35 h-12 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={110}
                height={45}
                className="max-h-10 w-auto object-contain"
              />
            </div>
          ))}


          {partners.map((partner, index) => (
            <div
              key={`partner-2-${index}`}
              className="flex items-center justify-center min-w-35 h-12 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={110}
                height={45}
                className="max-h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}