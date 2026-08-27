"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiEye, mdiEyeOff, mdiLock, mdiEmail, mdiLoading, mdiStorefront, mdiShieldCheckOutline } from "@mdi/js";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Email atau password salah");
      }

      const userRole = data.user?.role || data.role || "";
      if (userRole) {
        localStorage.setItem("role", userRole);
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary relative overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-light opacity-30 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-medium opacity-30 blur-3xl pointer-events-none" />


      <div className="w-full max-w-5xl bg-[#ffffff] rounded-3xl shadow-[0_25px_60px_-15px_rgba(20,60,58,0.3)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-teal-light/40 relative z-10">
        
        
        <div className="hidden lg:flex lg:col-span-5 bg-linear-to-br from-primary via-primary to-teal-medium p-10 flex-col justify-between relative text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(165,233,221,0.2),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ffffff]/15 backdrop-blur-md flex items-center justify-center border border-[#ffffff]/20 shadow-inner">
              <Icon path={mdiStorefront} size={1.2} className="text-teal-light" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-teal-100">TEMU UMKM</span>
              <p className="text-sm font-semibold text-white/90">Kabupaten Bekasi</p>
            </div>
          </div>

          <div className="relative z-10 space-y-4 my-auto py-10">
            <h2 className="text-3xl font-black tracking-tight leading-snug">
              Admin Panel <br />
              <span className="text-teal-light">Sistem TEMU</span>
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed font-light max-w-sm">
              Kelola direktori UMKM, produk bermitra, berita, dan aspirasi daerah dalam satu sistem terintegrasi yang aman dan efisien.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-[14px] text-teal-100 font-light">
            <Icon path={mdiShieldCheckOutline} size={0.9} />
            <span>Sistem Otentikasi Terenkripsi & Aman</span>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#ffffff]">
          
          {/*header */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon path={mdiStorefront} size={1} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">TEMU UMKM KAB. BEKASI</h2>
              <p className="text-[11px] text-slate-500 font-medium">Portal Admin Resmi</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 tracking-tight">Selamat Datang</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Silakan masukkan akun administrator Anda untuk melanjutkan.
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-semibold mb-6 border border-red-200/80 flex items-center gap-3 shadow-sm animate-shake">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Admin Panel <span className="text-teal-600">TEMU</span>
              </label>
              <div className="relative flex items-center">
                <Icon
                  path={mdiEmail}
                  size={0.9}
                  className="absolute left-4 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-primary text-slate-900 font-medium transition-all shadow-inner"
                  placeholder="Masukkan e-mail anda"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <Icon
                  path={mdiLock}
                  size={0.9}
                  className="absolute left-4 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-primary text-slate-900 font-medium transition-all shadow-inner"
                  placeholder="Masukkan kata sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-primary transition-colors"
                >
                  <Icon path={showPassword ? mdiEyeOff : mdiEye} size={0.9} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-primary to-teal-medium hover:from-[#2c7c78] hover:to-[#5da69b] text-white text-xs sm:text-sm font-medium py-4 px-6 rounded-full transition-all shadow-xl shadow-primary/25 flex justify-center items-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Icon path={mdiLoading} size={0.8} className="animate-spin text-white" />
                  <span>Tunggu sebentar yaa...</span>
                </>
              ) : (
                <span>Masuk Ke Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Pemerintah Kabupaten Bekasi dan Program Studi Sains Data ITSB
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}