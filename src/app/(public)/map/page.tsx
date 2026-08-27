import { db } from "@/db";
import { umkm } from "@/db/schema";
import { count } from "drizzle-orm";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiMapMarkerRadius, mdiStorefront, mdiCityVariantOutline } from "@mdi/js";
import MapWrapper from "./MapWrapper";
import { KAB_BEKASI_DISTRICTS, DISTRICT_COORDINATES } from "@/utils/constants";

export const revalidate = 0;

export default async function MapPage() {

  const umkmCounts = await db
    .select({
      district: umkm.district,
      total: count(),
    })
    .from(umkm)
    .groupBy(umkm.district);

  const countMap = new Map<string, number>();
  umkmCounts.forEach((item) => {
    if (item.district) {
      countMap.set(item.district, item.total);
    }
  });

  // kecamatan
  const dataKecamatan = KAB_BEKASI_DISTRICTS.map((districtName) => {
    const coords = DISTRICT_COORDINATES[districtName] || { lat: -6.3200, lng: 107.1500 };
    return {
      name: districtName,
      lat: coords.lat,
      lng: coords.lng,
      totalUmkm: countMap.get(districtName) || 0,
    };
  });

  // Total
  const totalSeluruhUmkm = dataKecamatan.reduce((acc, curr) => acc + curr.totalUmkm, 0);

  return (
    <div className="min-h-screen bg-surface text-[#2D3748] flex flex-col font-sans">
      


      <section className="bg-linear-to-br from-[rgba(165,233,221,0.25)] via-[rgba(255,255,255,0.8)] to-[rgba(244,250,249,1)] py-10 md:py-14 border-b border-teal-medium/20">
        <div className="max-w-310 mx-auto px-6 text-center space-y-4">
          <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
            Direktori Geospasial Wilayah
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#194C49] tracking-tight">
            Sebaran Spasial UMKM Kabupaten Bekasi
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#64748B] max-w-180 mx-auto leading-relaxed">
            Eksplorasi persebaran potensi wirausaha lokal di seluruh wilayah secara real-time. Klik ikon marker pada peta untuk melihat rincian tiap kecamatan.
          </p>


          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-[0_8px_25px_rgba(52,144,139,0.08)] border border-teal-light/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Icon path={mdiStorefront} size={1} />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-[#64748B] font-semibold block">Total UMKM Terdaftar</span>
                <span className="text-base md:text-lg font-extrabold text-[#194C49]">{totalSeluruhUmkm} Unit</span>
              </div>
            </div>

            <div className="bg-white px-5 py-3 rounded-2xl shadow-[0_8px_25px_rgba(52,144,139,0.08)] border border-teal-light/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Icon path={mdiCityVariantOutline} size={1} />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-[#64748B] font-semibold block">Wilayah Cakupan</span>
                <span className="text-base md:text-lg font-extrabold text-[#194C49]">23 Kecamatan</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="max-w-310 mx-auto w-full px-6 py-8 md:py-12 flex-1">
        <div className="bg-white p-3 sm:p-4 rounded-[28px] shadow-[0_12px_35px_rgba(52,144,139,0.08)] border border-teal-medium/30">
          <MapWrapper dataKecamatan={dataKecamatan} />
        </div>
      </section>


    </div>
  );
}