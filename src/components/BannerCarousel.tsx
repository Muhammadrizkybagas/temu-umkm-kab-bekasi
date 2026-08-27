"use client";

import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { 
  mdiCalendarBlankOutline, 
  mdiMapMarkerRadiusOutline, 
  mdiChevronLeft, 
  mdiChevronRight 
} from "@mdi/js";

export default function BannerCarousel({ banners }: { banners: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // auto slide
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section 
      className="w-full bg-white border-b border-gray-100 py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative w-full aspect-3/1 rounded-3xl overflow-hidden shadow-lg border border-gray-100 group bg-gray-900">
          
          
          <div 
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div 
                key={banner.id || index} 
                className="relative min-w-full h-full flex flex-col justify-end bg-gray-950"
              >
                
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />


                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* info konten */}
                <div className="relative z-10 p-5 sm:p-8 md:p-10 space-y-2 text-white max-w-4xl pointer-events-none">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-md">
                    {banner.title}
                  </h2>

                  {banner.subtitle && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 font-normal drop-shadow">
                      {banner.subtitle}
                    </p>
                  )}

                  {(banner.dateText || banner.locationText) && (
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm font-medium text-amber-300">
                      {banner.dateText && (
                        <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                          <Icon path={mdiCalendarBlankOutline} size={0.75} />
                          {banner.dateText}
                        </span>
                      )}
                      {banner.locationText && (
                        <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                          <Icon path={mdiMapMarkerRadiusOutline} size={0.75} />
                          {banner.locationText}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>


          {banners.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                aria-label="Previous Slide"
              >
                <Icon path={mdiChevronLeft} size={1} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                aria-label="Next Slide"
              >
                <Icon path={mdiChevronRight} size={1} />
              </button>

\
              <div className="absolute right-6 bottom-6 z-20 flex items-center gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? "w-6 bg-accent" : "w-2 bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}