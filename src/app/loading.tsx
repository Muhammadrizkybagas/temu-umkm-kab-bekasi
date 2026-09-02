import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs transition-all">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white shadow-xl shadow-slate-100 border border-slate-100 animate-fade-in">
        
        {/* logo */}
        <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 animate-pulse">
          <Image 
            src="/logo.svg" 
            alt="Logo TEMU UMKM" 
            width={40} 
            height={40} 
            className="object-contain"
            priority
          />
        </div>

        {/* Loading Spinner */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-[14px] font-bold text-slate-700 tracking-wide mt-1">
            Memuat data TEMU...
          </p>
          <p className="text-[14px] font-medium text-slate-400">
            Sebentar ya 😊
          </p>
        </div>

      </div>
    </div>
  );
}