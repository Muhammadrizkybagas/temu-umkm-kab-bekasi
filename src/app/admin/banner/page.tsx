import Link from "next/link";
import { db } from "@/db";
import { banners } from "@/db/schema";
import { desc } from "drizzle-orm";
import Icon from "@mdi/react";
import { mdiPlus, mdiImage, mdiTrashCanOutline, mdiPencilOutline, mdiEye, mdiEyeOff, mdiCalendarBlankOutline, mdiMapMarkerOutline } from "@mdi/js";
import { toggleBannerStatus, deleteBanner } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  const allBanners = await db.select().from(banners).orderBy(desc(banners.order));

  return (
    <div className="space-y-6 pb-10">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Manajemen Banner & Slider</h1>
          <p className="text-sm text-gray-500">Kelola publikasi banner & slider UMKM Kabupaten Bekasi</p>
        </div>
        <Link 
          href="/admin/banner/tambah" 
          className="bg-primary hover:bg-[#2489b5] text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm text-center sm:w-auto w-full"
        >
          <Icon path={mdiPlus} size={0.8} /> Tambah Banner
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {allBanners.length === 0 ? (
          <div className="p-12 text-center">
            <Icon path={mdiImage} size={2} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium text-sm">Belum ada banner atau slider yang diunggah.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                  <th className="p-4 font-semibold">Preview (3:1)</th>
                  <th className="p-4 font-semibold">Header & Keterangan</th>
                  <th className="p-4 font-semibold">Jadwal & Lokasi</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {allBanners.map((banner) => (
                  <tr key={banner.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="w-28 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 relative shadow-xs">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{banner.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{banner.subtitle || "-"}</p>
                    </td>
                    <td className="p-4 text-xs text-slate-600 space-y-1.5 font-medium">
                      <div className="flex items-center gap-2">
                        <Icon path={mdiCalendarBlankOutline} size={0.7} className="text-slate-400 shrink-0" />
                        <span>{banner.dateText || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon path={mdiMapMarkerOutline} size={0.7} className="text-slate-400 shrink-0" />
                        <span>{banner.locationText || "-"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {banner.isActive === 1 ? (
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full">Aktif</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full">Non-Aktif</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      
                      <form action={toggleBannerStatus.bind(null, banner.id, banner.isActive)} className="inline">
                        <button title="Ubah Status" className="p-2 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-lg transition-colors">
                          <Icon path={banner.isActive === 1 ? mdiEyeOff : mdiEye} size={0.8} />
                        </button>
                      </form>

                      {/* Tombol Hapus */}
                      <form action={deleteBanner.bind(null, banner.id)} className="inline">
                        <button title="Hapus Banner" className="p-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-lg transition-colors">
                          <Icon path={mdiTrashCanOutline} size={0.8} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}