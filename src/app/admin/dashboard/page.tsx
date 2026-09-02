import Link from "next/link";
import { db } from "@/db";
import { umkm, categories, products } from "@/db/schema";
import { desc } from "drizzle-orm";
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
  mdiHandshake
} from "@mdi/js";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const allUmkm = await db.select().from(umkm);
  const allCategories = await db.select().from(categories);
  const allProducts = await db.select().from(products);

  const totalUmkm = allUmkm.length;
  const totalProducts = allProducts.length;

  const totalNaikKelas = allUmkm.filter((item) => item.isNaikKelas === true).length;
  const totalTidakNaikKelas = totalUmkm - totalNaikKelas;
  const naikKelasRate = totalUmkm > 0 ? ((totalNaikKelas / totalUmkm) * 100).toFixed(1) : "0";

  const totalBermitra = allUmkm.filter((item) => item.status === "Bermitra").length;
  const bermitraRate = totalUmkm > 0 ? ((totalBermitra / totalUmkm) * 100).toFixed(1) : "0";

  const districtCounts: Record<string, number> = {};
  allUmkm.forEach((item) => {
    const dist = item.district || "Lainnya";
    districtCounts[dist] = (districtCounts[dist] || 0) + 1;
  });

  const sortedDistricts = Object.entries(districtCounts).sort((a, b) => b[1] - a[1]);
  const maxLocalDistrictCount = sortedDistricts.length > 0 ? sortedDistricts[0][1] : 1;

  const categoryProductCounts: Record<string, number> = {};
  allCategories.forEach((cat) => { categoryProductCounts[cat.name] = 0; });
  allProducts.forEach((prod) => {
    const matchedCategory = allCategories.find((cat) => cat.id === prod.categoryId);
    const catName = matchedCategory ? matchedCategory.name : "Lainnya";
    categoryProductCounts[catName] = (categoryProductCounts[catName] || 0) + 1;
  });

  const categoryHistogramData = Object.entries(categoryProductCounts);
  const maxCategoryCount = Math.max(...Object.values(categoryProductCounts), 1);

  const recentUmkm = await db.select().from(umkm).orderBy(desc(umkm.createdAt)).limit(5);

  const stats = [
    { title: "Total UMKM Terdaftar", value: totalUmkm, icon: mdiDomain, color: "bg-blue-500/10 text-blue-600 border-blue-100", href: "/admin/umkm" },
    { title: "Total Katalog Produk", value: totalProducts, icon: mdiPackageVariantClosed, color: "bg-emerald-500/10 text-emerald-600 border-emerald-100", href: "/admin/produk" },
    { title: "UMKM Naik Kelas", value: `${totalNaikKelas} (${naikKelasRate}%)`, icon: mdiTrendingUp, color: "bg-amber-500/10 text-amber-600 border-amber-100", href: "/admin/umkm" },
    { title: "UMKM Bermitra", value: `${totalBermitra} (${bermitraRate}%)`, icon: mdiHandshake, color: "bg-purple-500/10 text-purple-600 border-purple-100", href: "/admin/umkm" },
  ];

  const naikPct = totalUmkm > 0 ? (totalNaikKelas / totalUmkm) * 100 : 0;
  const regulerPct = 100 - naikPct;

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes growWidth { from { width: 0%; } }
        .animate-grow-width { animation: growWidth 1s cubic-bezier(0.1, 0.7, 0.1, 1) forwards; }
        
        @keyframes growHeight { from { height: 0%; opacity: 0; } to { opacity: 1; } }
        .animate-grow-height { animation: growHeight 1.2s cubic-bezier(0.1, 0.7, 0.1, 1) forwards; }
        
        @keyframes donutSpin { 0% { transform: rotate(-90deg) scale(0.8); opacity: 0; } 100% { transform: rotate(0deg) scale(1); opacity: 1; } }
        .animate-donut { animation: donutSpin 0.8s cubic-bezier(0.1, 0.7, 0.1, 1) forwards; }

        .force-scrollbar::-webkit-scrollbar { width: 6px; display: block; }
        .force-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .force-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .force-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .force-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f8fafc; }
      `}} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/5 to-teal-500/5 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-teal-600 font-bold text-[10px] tracking-wider uppercase mb-2 border border-blue-100/60 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
            Data Science & Analytics
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Dashboard Katalog UMKM</h1>
        </div>
        <Link href="/admin/umkm" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white px-6 py-3 rounded-full font-medium text-[13px] tracking-wide transition-all shadow-md shadow-blue-600/20 relative z-10">
          <Icon path={mdiPlus} size={0.8} /> Entri Data UMKM
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {stats.map((item, index) => (
          <Link key={index} href={item.href} className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl group-hover:bg-blue-50 transition-colors pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color} shadow-xs transition-transform group-hover:scale-110 duration-300`}>
                <Icon path={item.icon} size={1.2} />
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                Detail <Icon path={mdiArrowRight} size={0.6} />
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 tracking-tight relative z-10">{item.value}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider relative z-10">{item.title}</p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* District Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Icon path={mdiMapMarkerRadius} size={0.9} />
                </div>
                Konsentrasi Spasial Kecamatan
              </h2>
            </div>

            {sortedDistricts.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">Belum ada data</div>
            ) : (
              <div className="h-72 overflow-y-scroll pr-3 space-y-4 force-scrollbar">
                {sortedDistricts.map(([district, count], idx) => {
                  const relativePercentage = Math.round((count / maxLocalDistrictCount) * 100);
                  return (
                    <div key={idx} className="pr-1 group">
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-700 group-hover:text-blue-600 transition-colors">{district}</span>
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 text-[11px]">{count} UMKM</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                        <div 
                          className="bg-linear-to-r from-blue-500 to-teal-500 h-full rounded-full transition-all duration-500 group-hover:brightness-110 animate-grow-width" 
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

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group/card hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs group-hover/card:scale-105 transition-transform">
                  <Icon path={mdiChartDonut} size={0.9} />
                </div>
                Status Kualifikasi (Naik Kelas)
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-2">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 animate-donut">
                <svg viewBox="0 0 42 42" className="w-full h-full drop-shadow-sm overflow-visible relative z-10">
                  <circle 
                    cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                    stroke="#f1f5f9" strokeWidth="6" 
                  ></circle>
                  <circle 
                    cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                    stroke="url(#emeraldGradient)" strokeWidth="6" 
                    strokeDasharray={`${naikPct} ${100 - naikPct}`} 
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    className="peer/naik transition-all duration-300 hover:stroke-[8px] cursor-pointer drop-shadow-xs"
                  ></circle>
                  <circle 
                    cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                    stroke="url(#blueGradient)" strokeWidth="6" 
                    strokeDasharray={`${regulerPct} ${100 - regulerPct}`} 
                    strokeDashoffset={25 - naikPct}
                    strokeLinecap="round"
                    className="peer/reguler transition-all duration-300 hover:stroke-[8px] cursor-pointer drop-shadow-xs"
                  ></circle>
                  
                  <defs>
                    <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-4 rounded-full bg-slate-50/50 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none transition-all duration-300 opacity-100 peer-hover/naik:opacity-0 peer-hover/reguler:opacity-0 z-0 border border-slate-100/80 shadow-inner">
                  <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">TOTAL UMKM</span>
                  <span className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight">{totalUmkm}</span>
                </div>

                <div className="absolute inset-4 rounded-full bg-emerald-50/70 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none transition-all duration-300 opacity-0 peer-hover/naik:opacity-100 z-0 border border-emerald-100 shadow-inner">
                  <span className="text-[10px] text-emerald-600 font-extrabold tracking-widest uppercase">NAIK KELAS</span>
                  <span className="text-3xl font-black text-emerald-700 mt-0.5 tracking-tight">{totalNaikKelas}</span>
                </div>

                <div className="absolute inset-4 rounded-full bg-blue-50/70 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none transition-all duration-300 opacity-0 peer-hover/reguler:opacity-100 z-0 border border-blue-100 shadow-inner">
                  <span className="text-[10px] text-blue-600 font-extrabold tracking-widest uppercase">REGULER</span>
                  <span className="text-3xl font-black text-blue-700 mt-0.5 tracking-tight">{totalTidakNaikKelas}</span>
                </div>
              </div>

              <div className="space-y-3 w-full sm:w-auto">
                <div className="flex items-center gap-3.5 bg-slate-50/60 hover:bg-emerald-50/40 p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200/60 transition-all duration-200 group/item cursor-pointer">
                  <span className="w-4 h-4 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/30 shrink-0 group-hover/item:scale-110 transition-transform"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-700 group-hover/item:text-emerald-700 transition-colors">Naik Kelas</p>
                    <p className="text-xs font-black text-emerald-600">{totalNaikKelas} UMKM <span className="font-semibold text-slate-400">({naikKelasRate}%)</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3.5 bg-slate-50/60 hover:bg-blue-50/40 p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200/60 transition-all duration-200 group/item cursor-pointer">
                  <span className="w-4 h-4 rounded-full bg-linear-to-br from-blue-400 to-blue-600 shadow-sm shadow-blue-500/30 shrink-0 group-hover/item:scale-110 transition-transform"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-700 group-hover/item:text-blue-700 transition-colors">Belum Naik Kelas</p>
                    <p className="text-xs font-black text-blue-600">{totalTidakNaikKelas} UMKM <span className="font-semibold text-slate-400">({totalUmkm > 0 ? (100 - Number(naikKelasRate)).toFixed(1) : 0}%)</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* histogram */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group/card hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-light/20 text-primary flex items-center justify-center border border-teal-light/40 shadow-xs group-hover/card:scale-105 transition-transform">
              <Icon path={mdiChartBar} size={0.9} />
            </div>
            Grafik Sebaran Kategori Produk
          </h2>
        </div>

        {categoryHistogramData.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">Belum ada data</div>
        ) : (
          <div className="relative w-full overflow-x-auto pb-3 pt-6 force-scrollbar">
            <div className="min-w-150 h-64 flex items-end gap-4 relative border-b border-slate-100">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-100/60 flex-1"></div>
                ))}
              </div>

              {categoryHistogramData.map(([categoryName, count], idx) => {
                const heightPercentage = maxCategoryCount > 0 ? Math.max((count / maxCategoryCount) * 80, 6) : 6; 
                
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group/bar">
                    <div 
                      className="relative w-full max-w-12 bg-linear-to-t from-primary via-teal-medium to-teal-medium hover:brightness-105 transition-all duration-300 rounded-t-xl shadow-md shadow-primary/15 animate-grow-height cursor-pointer"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-2xl pointer-events-none whitespace-nowrap z-30">
                        {categoryName}: {count} Produk
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="min-w-150 flex gap-4 pt-4">
              {categoryHistogramData.map(([categoryName], idx) => (
                <div key={idx} className="flex-1 text-center">
                  <p className="text-[11px] font-bold text-slate-500 truncate px-1" title={categoryName}>
                    {categoryName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* aktivitas terbaru */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group/card hover:shadow-md transition-all duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-medium/20 text-primary flex items-center justify-center border border-teal-medium/40 shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-slate-900">Log Aktivitas Terbaru</h2>
              <p className="text-[11px] font-semibold text-slate-400">Daftar UMKM yang baru saja terdaftar atau diperbarui</p>
            </div>
          </div>
          
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200/60">
            Total: {recentUmkm.length}
          </span>
        </div>

        {/* kalau kosong */}
        {!recentUmkm || recentUmkm.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Belum ada aktivitas tercatat</p>
            <p className="text-slate-400 text-[11px]">Data aktivitas UMKM terbaru akan muncul secara otomatis di sini.</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left text-xs border-collapse min-w-162.5">
                <thead>
                  <tr className="bg-primary text-white font-semibold tracking-wider text-[13px]">
                    <th className="p-3.5 font-normal">Nama UMKM</th>
                    <th className="p-3.5 font-normal">Pemilik</th>
                    <th className="p-3.5 font-normal">Kecamatan</th>
                    <th className="p-3.5 font-normal">Kualifikasi</th>
                    <th className="p-3.5 font-normal">Kemitraan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentUmkm.map((item, index) => {
                    const isEven = index % 2 === 1;

                    return (
                      <tr 
                        key={item.id} 
                        className={`border-b border-slate-100 transition-colors group ${
                          isEven ? "bg-teal-light/15 hover:bg-teal-light/30" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <td className="p-3.5 font-bold text-slate-600 text-[12px] group-hover:text-primary transition-colors">
                          {item.name}
                        </td>
                        <td className="p-3.5 font-medium text-[12px] text-slate-600">{item.ownerName}</td>
                        <td className="p-3.5 font-medium text-slate-500">{item.district}</td>
                        <td className="p-3.5">
                          {item.isNaikKelas ? (
                            <span className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-[12px] font-medium px-3 py-1 rounded-full border border-teal-medium/40 shadow-xs inline-block">
                              Naik Kelas
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 text-[12px] font-medium px-3 py-1 rounded-full border border-slate-200/60 shadow-xs inline-block">
                              Reguler
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {item.status === "Bermitra" ? (
                            <span className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-[12px] font-medium px-3 py-1 rounded-full border border-teal-medium/40 shadow-xs inline-block">
                              Bermitra
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 text-[12px] font-medium px-3 py-1 rounded-full border border-slate-200/60 shadow-xs inline-block">
                              {item.status || "Inkubator"}
                            </span>
                          )}
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