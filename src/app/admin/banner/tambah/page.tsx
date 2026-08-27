"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBanner } from "../actions";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiContentSave, mdiCheckCircle, mdiLoading, mdiAlertCircle } from "@mdi/js";

export default function AddBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await createBanner(formData);

    setLoading(false);
    if (res?.success) {
      setFeedback({ success: true, message: res.message });
      setTimeout(() => {
        router.push("/admin/banner");
        router.refresh();
      }, 1200);
    } else {
      setFeedback({ success: false, message: res?.message || "Gagal mengunggah banner." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Animasi Notifikasi Sukses / Gagal */}
      {feedback && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white transition-all duration-300 animate-bounce ${feedback.success ? "bg-emerald-600" : "bg-red-600"}`}>
          <Icon path={feedback.success ? mdiCheckCircle : mdiAlertCircle} size={1.2} />
          <span className="text-sm font-bold">{feedback.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/banner" className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
            <Icon path={mdiArrowLeft} size={1} />
          </Link>
          <h1 className="text-xl font-extrabold text-gray-800">Tambah Banner / Slider Baru</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Header Text (Judul Utama) *</label>
          <input 
            type="text" 
            name="title" 
            required 
            placeholder="Contoh: Festival UMKM Bekasi 2026" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Keterangan / Deskripsi Singkat</label>
          <textarea 
            name="subtitle" 
            rows={3} 
            placeholder="Keterangan pendukung di bawah judul..." 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tanggal (Opsional)</label>
            <input 
              type="text" 
              name="dateText" 
              placeholder="Contoh: 25 - 28 Agustus 2026" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Lokasi / Tempat (Opsional)</label>
            <input 
              type="text" 
              name="locationText" 
              placeholder="Contoh: Gedung Juang Tambun Bekasi" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Unggah Gambar Banner (Rasio 3:1, Maks 3MB) *</label>
          <input 
            type="file" 
            name="image" 
            accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-[11px] text-gray-400 mt-1">Format didukung: PNG, JPG, JPEG, HEIC, WEBP. Maksimal ukuran 3 MB.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Urutan Tampil (Prioritas)</label>
            <input 
              type="number" 
              name="order" 
              defaultValue={0} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center h-full pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isActive" defaultChecked className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
              <span className="text-sm font-semibold text-gray-700">Aktifkan Banner Ini</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link href="/admin/banner" className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-all">
            Batal
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Icon path={mdiLoading} size={0.8} className="animate-spin" /> : <Icon path={mdiContentSave} size={0.8} />}
            {loading ? "Menyimpan..." : "Simpan Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}