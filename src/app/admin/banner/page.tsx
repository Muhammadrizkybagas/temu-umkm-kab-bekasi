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
    <div className="max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Banner & Slider</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Kelola publikasi banner & slider UMKM Kabupaten Bekasi</p>
        </div>
        <Link 
          href="/admin/banner/tambah" 
          className="bg-primary hover:bg-teal-medium text-white px-5 py-2.5 rounded-full font-normal text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 text-center sm:w-auto w-full cursor-pointer"
        >
          <Icon path={mdiPlus} size={0.8} /> Tambah Banner
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        {allBanners.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-1">
              <Icon path={mdiImage} size={1.2} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Belum ada banner atau slider yang diunggah.</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left text-xs whitespace-nowrap md:whitespace-normal border-collapse">
                <thead>
                  <tr className="bg-primary text-white font-semibold text-[14px]">
                    <th className="p-3.5 font-normal">Thumbnail</th>
                    <th className="p-3.5 font-normal">Header & Keterangan</th>
                    <th className="p-3.5 font-normal">Jadwal & Lokasi</th>
                    <th className="p-3.5 font-normal">Status</th>
                    <th className="p-3.5 font-normal text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {allBanners.map((banner, index) => {
                    const isEven = index % 2 === 1;

                    return (
                      <tr 
                        key={banner.id} 
                        className={`border-b border-slate-100 transition-colors ${
                          isEven ? "bg-teal-light/15 hover:bg-teal-light/30" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="w-28 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 relative shadow-2xs">
                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <p className="font-semibold text-slate-800">{banner.title}</p>
                          <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{banner.subtitle || "-"}</p>
                        </td>
                        <td className="p-3.5 text-xs text-slate-600 space-y-1 font-normal">
                          <div className="flex items-center gap-2">
                            <Icon path={mdiCalendarBlankOutline} size={0.7} className="text-slate-400 shrink-0" />
                            <span>{banner.dateText || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon path={mdiMapMarkerOutline} size={0.7} className="text-slate-400 shrink-0" />
                            <span>{banner.locationText || "-"}</span>
                          </div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap font-normal">
                          {banner.isActive === 1 ? (
                            <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 inline-block">Aktif</span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200 inline-block">Non-Aktif</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="flex gap-2 justify-center items-center">
                            <form action={toggleBannerStatus.bind(null, banner.id, banner.isActive)} className="inline">
                              <button 
                                title="Ubah Status" 
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-normal rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Icon path={banner.isActive === 1 ? mdiEyeOff : mdiEye} size={0.7} />
                                {banner.isActive === 1 ? "Sembunyikan" : "Tampilkan"}
                              </button>
                            </form>

                            <form action={deleteBanner.bind(null, banner.id)} className="inline">
                              <button 
                                title="Hapus Banner" 
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-700 text-white text-xs font-normal rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Icon path={mdiTrashCanOutline} size={0.7} />
                                Hapus
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}