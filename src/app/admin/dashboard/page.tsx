import Link from "next/link";
import nextDynamic from "next/dynamic";
import { db } from "@/db";
import { umkm, categories, products, contactMessages, activityLogs, partners, umkmPartners } from "@/db/schema";
import { desc, eq, count, sql } from "drizzle-orm";
import Icon from "@mdi/react";
import { 
  mdiDomain, 
  mdiPackageVariantClosed, 
  mdiPlus, 
  mdiArrowRight,
  mdiMapMarkerRadius,
  mdiChartDonut,
  mdiChartBar,
  mdiTrendingUp,
  mdiHandshake,
  mdiEmail,
  mdiHistory,
  mdiClockOutline
} from "@mdi/js";
import { DISTRICT_COORDINATES, KAB_BEKASI_DISTRICTS } from "@/utils/constants";
import PartnerBarChart from "./PartnerBarChart";
import CategoryBarChart from "./CategoryBarChart";

const MapClient = nextDynamic(() => import("@/app/(public)/map/MapClient"), { 
  loading: () => <div className="h-112.5 flex items-center justify-center bg-slate-50 rounded-2xl text-xs text-slate-400 font-medium">Memuat Peta Spasial Kabupaten Bekasi...</div>
});

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const allUmkm = await db.select().from(umkm);
  const allCategories = await db.select().from(categories);
  const allProducts = await db.select().from(products);
  const unreadMessages = await db.select().from(contactMessages).where(eq(contactMessages.status, "UNREAD"));
  const recentLogs = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(5);

  const totalUmkm = allUmkm.length;
  const totalProducts = allProducts.length;
  const totalUnread = unreadMessages.length;

  const totalNaikKelas = allUmkm.filter((item) => item.isNaikKelas === true).length;
  const totalInkubator = totalUmkm - totalNaikKelas;
  const naikKelasRate = totalUmkm > 0 ? ((totalNaikKelas / totalUmkm) * 100).toFixed(1) : "0";
  const inkubatorRate = totalUmkm > 0 ? ((totalInkubator / totalUmkm) * 100).toFixed(1) : "0";

  const totalBermitra = allUmkm.filter((item) => item.status === "Bermitra").length;
  const totalMandiri = totalUmkm - totalBermitra;
  const bermitraRate = totalUmkm > 0 ? ((totalBermitra / totalUmkm) * 100).toFixed(1) : "0";
  const mandiriRate = totalUmkm > 0 ? ((totalMandiri / totalUmkm) * 100).toFixed(1) : "0";

  const districtCounts: Record<string, number> = {};
  KAB_BEKASI_DISTRICTS.forEach((d) => { districtCounts[d] = 0; });
  allUmkm.forEach((item) => {
    if (item.district && districtCounts[item.district] !== undefined) {
      districtCounts[item.district] += 1;
    }
  });

  const sortedDistrictsAll = Object.entries(districtCounts).sort((a, b) => b[1] - a[1]);
  const sortedDistricts = sortedDistrictsAll.slice(0, 5);
  const maxLocalDistrictCount = sortedDistricts.length > 0 ? sortedDistricts[0][1] : 1;

  const mapData = KAB_BEKASI_DISTRICTS.map((districtName) => ({
    name: districtName,
    lat: DISTRICT_COORDINATES[districtName]?.lat || -6.2600,
    lng: DISTRICT_COORDINATES[districtName]?.lng || 107.0600,
    totalUmkm: districtCounts[districtName] || 0,
  }));

  const partnerDataRaw = await db
    .select({
      partnerName: partners.name,
      totalUmkm: count(umkmPartners.umkmId),
    })
    .from(partners)
    .leftJoin(umkmPartners, sql`${partners.id} = ${umkmPartners.partnerId}`)
    .groupBy(partners.id, partners.name);

  const partnerStats = partnerDataRaw.map((p) => ({
    partnerName: p.partnerName,
    totalUmkm: Number(p.totalUmkm),
  }));

const categoryProductCounts: Record<string, number> = {};
  allCategories.forEach((cat) => { categoryProductCounts[cat.name] = 0; });
  allProducts.forEach((prod) => {
    const matchedCategory = allCategories.find((cat) => cat.id === prod.categoryId);
    const catName = matchedCategory ? matchedCategory.name : "Lainnya";
    categoryProductCounts[catName] = (categoryProductCounts[catName] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryProductCounts).map(([catName, count]) => ({
    categoryName: catName,
    totalProducts: count,
  }));
  
  const categoryHistogramData = Object.entries(categoryProductCounts);
  const maxCategoryCount = Math.max(...Object.values(categoryProductCounts), 1);

  const stats = [
    { title: "Total UMKM Terdaftar", value: totalUmkm, label: "UMKM Aktif", icon: mdiDomain, href: "/admin/umkm" },
    { title: "Katalog Produk", value: totalProducts, label: "Produk Terdaftar", icon: mdiPackageVariantClosed, href: "/admin/produk" },
    { title: "UMKM Naik Kelas", value: totalNaikKelas, label: `${naikKelasRate}% Kualifikasi`, icon: mdiTrendingUp, href: "/admin/umkm" },
    { title: "Pesan Belum Dibaca", value: totalUnread, label: "Butuh Respon", icon: mdiEmail, href: "/admin/kotak-masuk" },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-12 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes growWidth { from { width: 0%; } }
        @keyframes growHeight { from { height: 0%; opacity: 0; } to { opacity: 1; } }
        @keyframes donutSpin { 0% { transform: rotate(-90deg) scale(0.85); opacity: 0; } 100% { transform: rotate(0deg) scale(1); opacity: 1; } }
        
        .animate-fade-in { animation: fadeInSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-grow-width { animation: growWidth 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-grow-height { animation: growHeight 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-donut { animation: donutSpin 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .custom-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: #F8FAFC; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #A5E9DD; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #6FBEB2; }
      `}} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-light/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-light/30 text-primary font-semibold text-[11px] tracking-wide mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Pusat Analisis & Informasi
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Dashboard Katalog UMKM</h1>
        </div>
        <Link href="/admin/umkm" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white px-5 py-2.5 rounded-full font-medium text-xs tracking-wide transition-all shadow-sm relative z-10">
          <Icon path={mdiPlus} size={0.75} /> Entri Data UMKM
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 animate-fade-in">
        {stats.map((item, index) => (
          <Link key={index} href={item.href} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group block relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-light/20 text-primary flex items-center justify-center border border-teal-light/40 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Icon path={item.icon} size={1} />
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-primary transition-colors flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                Detail <Icon path={mdiArrowRight} size={0.5} />
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-0.5">{item.value}</h3>
            <p className="text-xs font-semibold text-slate-600">{item.title}</p>
            <p className="text-[11px] text-slate-400 mt-1">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className="animate-fade-in">
        <PartnerBarChart data={partnerStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-light/25 text-primary flex items-center justify-center border border-teal-light/50">
                  <Icon path={mdiMapMarkerRadius} size={0.85} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Konsentrasi Spasial Kecamatan</h2>
                  <p className="text-[11px] text-slate-400">Top 5 wilayah dengan UMKM terbanyak</p>
                </div>
              </div>
            </div>

            {sortedDistricts.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-medium">Belum ada data kecamatan</div>
            ) : (
              <div className="space-y-4">
                {sortedDistricts.map(([district, count], idx) => {
                  const relativePercentage = Math.round((count / maxLocalDistrictCount) * 100);
                  return (
                    <div key={idx} className="group">
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-slate-700 group-hover:text-primary transition-colors">{district}</span>
                        <span className="text-primary font-semibold bg-teal-light/20 px-2.5 py-0.5 rounded-full text-[11px]">{count} UMKM</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div 
                          className="bg-linear-to-r from-teal-medium to-primary h-full rounded-full transition-all duration-500 animate-grow-width" 
                          style={{ width: `${relativePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between group/card">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-light/25 text-primary flex items-center justify-center border border-teal-light/50">
                <Icon path={mdiChartDonut} size={0.85} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Status Kualifikasi</h2>
                <p className="text-[11px] text-slate-400">Rasio UMKM Naik Kelas vs Inkubator</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative w-40 h-40 animate-donut">
                <svg viewBox="0 0 42 42" className="w-full h-full overflow-visible">
                  <circle cx="21" cy="21" r="15.9154" fill="transparent" stroke="#F1F5F9" strokeWidth="5.5" />
                  <circle 
                    cx="21" cy="21" r="15.9154" fill="transparent" 
                    stroke="#34908B" strokeWidth="5.5" 
                    strokeDasharray={`${naikKelasRate} ${100 - Number(naikKelasRate)}`} 
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    className="transition-all duration-300 hover:stroke-[7px] cursor-pointer"
                  />
                  <circle 
                    cx="21" cy="21" r="15.9154" fill="transparent" 
                    stroke="#6FBEB2" strokeWidth="5.5" 
                    strokeDasharray={`${inkubatorRate} ${100 - Number(inkubatorRate)}`} 
                    strokeDashoffset={25 - Number(naikKelasRate)}
                    strokeLinecap="round"
                    className="transition-all duration-300 hover:stroke-[7px] cursor-pointer"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">TOTAL</span>
                  <span className="text-2xl font-bold text-slate-800">{totalUmkm}</span>
                </div>
              </div>

              <div className="w-full space-y-2 mt-4">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="font-medium text-slate-700">Naik Kelas</span>
                  </div>
                  <span className="font-bold text-primary">{totalNaikKelas} <span className="font-normal text-slate-400">({naikKelasRate}%)</span></span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-medium"></span>
                    <span className="font-medium text-slate-700">Inkubator</span>
                  </div>
                  <span className="font-bold text-teal-medium">{totalInkubator} <span className="font-normal text-slate-400">({inkubatorRate}%)</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        
        <div className="lg:col-span-2">
          <CategoryBarChart data={categoryChartData} />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-light/25 text-primary flex items-center justify-center border border-teal-light/50">
                <Icon path={mdiHandshake} size={0.85} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Status Kemitraan</h2>
                <p className="text-[11px] text-slate-400">Kerjasama dengan Ritel/Mitra</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative w-40 h-40 animate-donut">
                <svg viewBox="0 0 42 42" className="w-full h-full overflow-visible">
                  <circle cx="21" cy="21" r="15.9154" fill="transparent" stroke="#F1F5F9" strokeWidth="5.5" />
                  <circle 
                    cx="21" cy="21" r="15.9154" fill="transparent" 
                    stroke="#34908B" strokeWidth="5.5" 
                    strokeDasharray={`${bermitraRate} ${100 - Number(bermitraRate)}`} 
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    className="transition-all duration-300 hover:stroke-[7px] cursor-pointer"
                  />
                  <circle 
                    cx="21" cy="21" r="15.9154" fill="transparent" 
                    stroke="#A5E9DD" strokeWidth="5.5" 
                    strokeDasharray={`${mandiriRate} ${100 - Number(mandiriRate)}`} 
                    strokeDashoffset={25 - Number(bermitraRate)}
                    strokeLinecap="round"
                    className="transition-all duration-300 hover:stroke-[7px] cursor-pointer"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">MITRA</span>
                  <span className="text-2xl font-bold text-slate-800">{totalBermitra}</span>
                </div>
              </div>

              <div className="w-full space-y-2 mt-4">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="font-medium text-slate-700">Sudah Bermitra</span>
                  </div>
                  <span className="font-bold text-primary">{totalBermitra} <span className="font-normal text-slate-400">({bermitraRate}%)</span></span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-light"></span>
                    <span className="font-medium text-slate-700">Mandiri / Inkubator</span>
                  </div>
                  <span className="font-bold text-slate-600">{totalMandiri} <span className="font-normal text-slate-400">({mandiriRate}%)</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-light/25 text-primary flex items-center justify-center border border-teal-light/50">
              <Icon path={mdiMapMarkerRadius} size={0.85} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Visualisasi Spasial Sebaran Wilayah</h2>
              <p className="text-[11px] text-slate-400">Pemetaan interaktif 23 Kecamatan di Kabupaten Bekasi</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-teal-light/20 text-primary rounded-full self-start sm:self-auto">
            Total 23 Kecamatan
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-xs">
          <MapClient dataKecamatan={mapData} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-light/25 text-primary flex items-center justify-center border border-teal-light/50">
              <Icon path={mdiHistory} size={0.85} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Log Aktivitas Terbaru</h2>
              <p className="text-[11px] text-slate-400">Riwayat aksi sistem oleh pengelola</p>
            </div>
          </div>
          <Link href="/admin/log-aktivitas" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Lihat Semua <Icon path={mdiArrowRight} size={0.5} />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">Belum ada aktivitas tercatat</div>
        ) : (
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left text-xs min-w-150">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
                  <th className="p-4">Pengguna</th>
                  <th className="p-4">Aksi</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">{log.userName}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-teal-light/30 text-primary font-semibold text-[11px] rounded-lg">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{log.description}</td>
                    <td className="p-4 text-slate-400 text-[11px] flex items-center gap-1">
                      <Icon path={mdiClockOutline} size={0.5} />
                      {log.createdAt ? new Date(log.createdAt).toLocaleDateString("id-ID") : "-"}
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