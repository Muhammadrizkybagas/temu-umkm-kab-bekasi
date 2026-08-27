"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiEye, mdiEyeOff, mdiLock, mdiEmail, mdiLoading } from "@mdi/js";

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
    <div className="min-h-screen bg-[linear-gradient(135deg,#134e4a_0%,#1f2937_100%)] flex items-center justify-center p-4 relative overflow-hidden selection:bg-teal-500 selection:text-white">
      {/* Latar */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[linear-gradient(135deg,#34908B,#6FBEB2)] opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[linear-gradient(135deg,#A5E9DD,#34908B)] opacity-15 blur-3xl pointer-events-none"></div>
      <div className="absolute top-[30%] right-[15%] w-[30vw] h-[30vw] rounded-full bg-teal-light opacity-10 blur-2xl pointer-events-none"></div>

      <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/40 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-50 text-teal-700 border border-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Icon path={mdiLock} size={1.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Login Admin</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Portal Digital UMKM Kabupaten Bekasi
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-xs font-semibold mb-6 border border-red-200/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative flex items-center">
              <Icon
                path={mdiEmail}
                size={0.8}
                className="absolute left-3.5 text-slate-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 text-slate-900 font-medium transition-all"
                placeholder="admin@umkmbekasi.id"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <Icon
                path={mdiLock}
                size={0.8}
                className="absolute left-3.5 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 text-slate-900 font-medium transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Icon path={showPassword ? mdiEyeOff : mdiEye} size={0.8} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-teal-600/30 flex justify-center items-center gap-2 mt-2 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <>
                <Icon path={mdiLoading} size={0.7} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk Ke Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}