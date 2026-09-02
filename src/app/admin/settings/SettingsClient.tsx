"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import {
  mdiCogOutline,
  mdiStorefrontOutline,
  mdiPhoneOutline,
  mdiMapMarkerOutline,
  mdiInstagram,
  mdiFacebook,
  mdiYoutube,
  mdiContentSaveOutline,
} from "@mdi/js";
import { updateSettings } from "./actions";

type SettingsType = {
  siteName: string;
  siteDescription: string;
  contactPhone: string;
  contactEmail: string;
  officeAddress: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
};

export default function SettingsClient({ initialSettings }: { initialSettings: SettingsType }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);

    setLoading(false);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: result.message,
        confirmButtonColor: "#2563eb",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: result.error,
        confirmButtonColor: "#dc2626",
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
          <p className="text-sm text-gray-500">
            Kelola informasi umum, kontak resmi, alamat, dan tautan media sosial.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* informasi umum */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Icon path={mdiStorefrontOutline} size={0.9} className="text-teal-600" />
            <h3 className="text-base font-bold text-gray-700">Informasi & SEO Website</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Website</label>
              <input
                type="text"
                name="siteName"
                defaultValue={initialSettings.siteName}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Website (SEO)</label>
              <textarea
                name="siteDescription"
                rows={3}
                defaultValue={initialSettings.siteDescription}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Informasi Kontak & Alamat */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Icon path={mdiPhoneOutline} size={0.9} className="text-teal-600" />
            <h3 className="text-base font-bold text-gray-700">Kontak & Alamat Kantor</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor Kontak / WhatsApp</label>
              <input
                type="text"
                name="contactPhone"
                defaultValue={initialSettings.contactPhone}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Resmi</label>
              <input
                type="email"
                name="contactEmail"
                defaultValue={initialSettings.contactEmail}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Kantor</label>
              <textarea
                name="officeAddress"
                rows={2}
                defaultValue={initialSettings.officeAddress}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Media Sosial */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Icon path={mdiInstagram} size={0.9} className="text-teal-600" />
            <h3 className="text-base font-bold text-gray-700">Tautan Media Sosial</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Icon path={mdiInstagram} size={0.6} className="text-teal-600" /> Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                placeholder="https://instagram.com/..."
                defaultValue={initialSettings.instagramUrl}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Icon path={mdiFacebook} size={0.6} className="text-blue-600" /> Facebook URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                placeholder="https://facebook.com/..."
                defaultValue={initialSettings.facebookUrl}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Icon path={mdiYoutube} size={0.6} className="text-red-600" /> YouTube URL
              </label>
              <input
                type="url"
                name="youtubeUrl"
                placeholder="https://youtube.com/..."
                defaultValue={initialSettings.youtubeUrl}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>


        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full text-sm transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
          >
            <Icon path={mdiContentSaveOutline} size={0.8} />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}