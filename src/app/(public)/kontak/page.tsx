"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import { 
  mdiAccountOutline, 
  mdiWhatsapp, 
  mdiMessageOutline, 
  mdiSendOutline, 
  mdiLoading,
  mdiFormatSection,
  mdiShieldCheckOutline,
  mdiClockFast,
  mdiHeadset
} from "@mdi/js";
import { submitContactMessage } from "./actions";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const result = await submitContactMessage(formData);
    setLoading(false);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Pesan Berhasil Terkirim!",
        text: "Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.",
        confirmButtonColor: "#34908B", 
        confirmButtonText: "Oke",
      });
      formElement.reset();
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Pesan",
        text: result.error || "Terjadi kesalahan pada server.",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Coba Lagi",
      });
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="px-3.5 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              Layanan Bantuan
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-3">
              Mari Terhubung dengan TEMU
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
              Punya pertanyaan seputar pendaftaran UMKM, kolaborasi, atau kendala sistem? Sampaikan kepada kami melalui formulir.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Icon path={mdiHeadset} size={0.85} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Dukungan Responsif</h4>
                <p className="text-[11px] text-slate-500 font-normal">Tim admin siap membantu kebutuhan Anda.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Icon path={mdiClockFast} size={0.85} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Proses Cepat</h4>
                <p className="text-[11px] text-slate-500 font-normal">Pesan langsung masuk ke sistem dashboard.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <Icon path={mdiShieldCheckOutline} size={0.85} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Keamanan Terjamin</h4>
                <p className="text-[11px] text-slate-500 font-normal">Data dan privasi Anda terlindungi dengan aman.</p>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Kirim Pesan</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Formulir di bawah akan langsung terhubung ke Kotak Masuk Administrator.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Icon path={mdiAccountOutline} size={0.85} />
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="cth. Budi Santoso"
                  className="w-full pl-10 pr-3.5 py-3 text-xs font-normal text-slate-800 placeholder:text-slate-400 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>


            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor WhatsApp</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-emerald-600">
                  <Icon path={mdiWhatsapp} size={0.85} />
                </span>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="cth. 081234567890"
                  className="w-full pl-10 pr-3.5 py-3 text-xs font-normal text-slate-800 placeholder:text-slate-400 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>


            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subjek / Keperluan</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Icon path={mdiFormatSection} size={0.85} />
                </span>
                <input
                  type="text"
                  name="subject"
                  placeholder="cth. Cara Daftar UMKM Baru"
                  className="w-full pl-10 pr-3.5 py-3 text-xs font-normal text-slate-800 placeholder:text-slate-400 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>


            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pesan</label>
              <div className="relative flex items-start">
                <span className="absolute left-3.5 top-3.5 text-slate-400">
                  <Icon path={mdiMessageOutline} size={0.85} />
                </span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                  className="w-full pl-10 pr-3.5 py-3 text-xs font-normal text-slate-800 placeholder:text-slate-400 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                ></textarea>
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-primary hover:bg-[#2d7d79] text-white font-semibold rounded-2xl text-xs transition-all shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon path={mdiLoading} size={0.85} className="animate-spin" />
                  <span>Mengirim Pesan...</span>
                </>
              ) : (
                <>
                  <Icon path={mdiSendOutline} size={0.85} />
                  <span>Kirim Pesan</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}