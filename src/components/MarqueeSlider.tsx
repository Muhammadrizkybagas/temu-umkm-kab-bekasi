"use client";

import { ReactNode } from "react";

interface MarqueeSliderProps {
  children: ReactNode[];
  speed?: number; // Durasi animasi dalam detik (semakin besar semakin pelan)
}

export default function MarqueeSlider({ children, speed = 25 }: MarqueeSliderProps) {
  if (!children || children.length === 0) return null;

  // Jika item sedikit (< 6), gandakan agar track cukup panjang menutupi layar besar
  let baseItems = [...children];
  while (baseItems.length < 6) {
    baseItems = [...baseItems, ...children];
  }

  return (
    <div className="w-full overflow-hidden select-none py-4 relative group">
      {/* Dynamic Keyframes & Styling */}
      <style jsx global>{`
        @keyframes marqueeSeamless {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee-track {
          display: flex;
          shrink: 0;
          gap: 1.5rem; /* Equivalent to gap-6 */
          min-width: 100%;
          animation: marqueeSeamless ${speed}s linear infinite;
        }
        .group:hover .animate-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex gap-6 w-max">
        {/* Track 1 */}
        <div className="animate-marquee-track">
          {baseItems.map((child, index) => (
            <div key={`track1-${index}`} className="shrink-0">
              {child}
            </div>
          ))}
        </div>

        {/* Track 2 (Seamless Mirror) */}
        <div className="animate-marquee-track" aria-hidden="true">
          {baseItems.map((child, index) => (
            <div key={`track2-${index}`} className="shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}