"use client";

import Link from "next/navigation";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import { 
  mdiCompassOff, 
  mdiHome, 
  mdiViewDashboard, 
  mdiAlertCircleOutline,
  mdiArrowLeft 
} from "@mdi/js";

export default function GlobalNotFound() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen w-full bg-slate-900 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
   
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none animate-pulse ${
        isAdmin ? "bg-red-500" : "bg-teal-400"
      }`} />
      <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none ${
        isAdmin ? "bg-orange-500" : "bg-emerald-500"
      }`} />

      {/* main card */}
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 relative z-10 p-8 sm:p-10 text-center transition-all">
        
        {/* badge error */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 shadow-xs border transition-colors duration-300"
          style={{
            backgroundColor: isAdmin ? "rgb(254 242 242)" : "rgb(240 253 250)",
            color: isAdmin ? "rgb(220 38 38)" : "rgb(13 148 136)",
            borderColor: isAdmin ? "rgb(254 202 202)" : "rgb(153 246 228)"
          }}
        >
          <span>Error 404</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>{isAdmin ? "Admin Area" : "Portal Publik"}</span>
        </div>


        <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-inner transform transition-transform hover:scale-105 duration-300 ${
          isAdmin 
            ? "bg-red-50 text-red-500 border border-red-100" 
            : "bg-teal-50 text-primary border border-teal-100"
        }`}>
          <Icon path={isAdmin ? mdiAlertCircleOutline : mdiCompassOff} size={3} />
        </div>
        
        {/* title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 tracking-tight mb-3">
          {isAdmin ? "Halaman Admin Tidak Ditemukan" : "Oops! Halaman Tidak Ditemukan"}
        </h1>
        
        {/* deskripsi */}
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed font-normal">
          {isAdmin
            ? "Fitur atau halaman admin yang kamu tuju belum tersedia, sedang dalam pengembangan, atau URL yang dimasukkan keliru."
            : "Tautan yang kamu akses mungkin sudah kedaluwarsa, salah pengetikan, atau belum tersedia di Portal UMKM Kabupaten Bekasi."}
        </p>

        {/* button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={isAdmin ? "/admin/dashboard" : "/"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold py-3.5 px-7 rounded-full transition-all shadow-lg shadow-primary/25 active:scale-[0.98]"
          >
            <Icon path={isAdmin ? mdiViewDashboard : mdiHome} size={0.9} />
            <span>{isAdmin ? "Dashboard Admin" : "Beranda Utama"}</span>
          </a>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold py-3.5 px-6 rounded-full transition-all active:scale-[0.98]"
          >
            <Icon path={mdiArrowLeft} size={0.9} />
            <span>Kembali</span>
          </button>
        </div>


        <div className="mt-8 pt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          Portal UMKM Kabupaten Bekasi dan Program Studi Sains Data ITSB &copy; {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
}