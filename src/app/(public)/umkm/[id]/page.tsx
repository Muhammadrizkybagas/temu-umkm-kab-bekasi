"use client";

import { use, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import { 
  mdiStorefront, 
  mdiMapMarker, 
  mdiWhatsapp, 
  mdiAccount, 
  mdiShieldCheck, 
  mdiArrowLeft, 
  mdiInformationOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiPackageVariantClosed,
  mdiHome
} from "@mdi/js";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string;
  categoryName?: string;
}

interface UmkmDetail {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  district: string;
  village: string;
  address: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  status: string;
  isNaikKelas: boolean;
  isFeatured: boolean;
  products: ProductItem[];
}

export default function UmkmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<UmkmDetail | null>(null);
  const [loading, setLoading] = useState(true);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch(`/api/public/umkm/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  
  const totalProducts = data?.products?.length || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    if (!data?.products) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return data.products.slice(start, start + itemsPerPage);
  }, [data?.products, currentPage]);

  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // smooth scroll
      const catalogSection = document.getElementById("katalog-produk");
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // nomor pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF] p-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-primary tracking-wide animate-pulse">
          Memuat Profil UMKM...
        </p>
      </div>
    );
  }

  if (!data || (data as any).error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#FFFFFF]">
        <div className="max-w-md w-full p-8 text-center bg-white rounded-3xl border border-teal-light/50 shadow-xl">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon path={mdiStorefront} size={1.5} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">UMKM Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Profil usaha yang Anda cari tidak tersedia atau telah dihapus dari direktori.
          </p>
          <Link 
            href="/katalog" 
            className="inline-flex items-center gap-2 bg-primary hover:bg-[#2b7773] text-white text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-md active:scale-95"
          >
            <Icon path={mdiArrowLeft} size={0.7} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const formattedPhone = data.phone.startsWith("0")
    ? `62${data.phone.slice(1)}`
    : data.phone;

  return (
    <div className="bg-[#FFFFFF] min-h-screen pb-24 text-slate-800">
      
      {/* Banner */}
      <div className="relative w-full h-52 sm:h-72 lg:h-80 bg-primary overflow-hidden">
        {data.coverUrl ? (
          <img 
            src={data.coverUrl} 
            alt={data.name} 
            className="w-full h-full object-cover opacity-90" 
          />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-primary via-teal-medium to-primary opacity-90" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Navigation Bar */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-10 flex items-center gap-2">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-primary px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg backdrop-blur-md active:scale-95"
          >
            <Icon path={mdiArrowLeft} size={0.7} />
            <span>Katalog</span>
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-light/40 shadow-[0_10px_30px_rgba(52,144,139,0.08)]">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            
            {/* Logo Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-teal-light/20 border-4 border-white shadow-md flex items-center justify-center font-black text-primary text-4xl shrink-0 overflow-hidden -mt-16 sm:-mt-20">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                data.name.charAt(0)
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-light/30 text-primary border border-teal-medium/30 px-3 py-1 rounded-full">
                  {data.status || "Inkubator"}
                </span>
                {data.isNaikKelas && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60 px-3 py-1 rounded-full">
                    <Icon path={mdiShieldCheck} size={0.6} className="text-amber-500" />
                    Naik Kelas
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {data.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600 mt-2">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Icon path={mdiAccount} size={0.7} className="text-primary" />
                  <span>{data.ownerName}</span>
                </div>
                <span className="hidden sm:inline text-slate-300">•</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Icon path={mdiMapMarker} size={0.7} className="text-red-500 shrink-0" />
                  <span>Desa {data.village}, Kec. {data.district}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2.5 font-medium">
                {data.address}
              </p>
            </div>

            {/* WhatsApp Contact Desktop */}
            <div className="w-full md:w-auto mt-2 md:mt-0 hidden sm:block">
              <a
                href={`https://wa.me/${formattedPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-primary hover:bg-[#2b7773] active:scale-95 text-white font-medium px-6 py-3.5 rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm transition-all shadow-lg shadow-primary/25"
              >
                <Icon path={mdiWhatsapp} size={0.9} />
                <span>Hubungi Pemilik via WA</span>
              </a>
            </div>
          </div>

          {/* About Section */}
          {data.description && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                <Icon path={mdiInformationOutline} size={0.7} />
                Tentang Usaha
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-teal-light/10 p-4 sm:p-5 rounded-2xl border border-teal-light/30">
                {data.description}
              </p>
            </div>
          )}
        </div>

        {/* Catalog Products */}
        <div id="katalog-produk" className="mt-10 sm:mt-12 scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Katalog Produk ({totalProducts})
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Pilihan produk unggulan resmi dari {data.name}
              </p>
            </div>
          </div>

          {totalProducts === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-teal-light/30 shadow-xs">
              <div className="w-14 h-14 bg-teal-light/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon path={mdiPackageVariantClosed} size={1.4} />
              </div>
              <p className="text-sm font-bold text-slate-700">Belum Ada Produk Ditampilkan</p>
              <p className="text-xs text-slate-400 mt-1">Pelaku usaha ini belum mengunggah katalog produk.</p>
            </div>
          ) : (
            <>
              {/* Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {paginatedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-teal-light/30 shadow-xs hover:shadow-xl hover:border-teal-medium transition-all duration-300 overflow-hidden flex flex-col group"
                  >
                    {/* gambar */}
                    <div className="relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-teal-medium/50 bg-teal-light/10">
                          <Icon path={mdiStorefront} size={2.5} />
                        </div>
                      )}
                      
                      {/* kategori */}
                      <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                        {item.categoryName || "Umum"}
                      </span>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/katalog/${item.slug}`} className="block group-hover:text-primary transition-colors">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 line-clamp-2 leading-snug">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-base sm:text-lg font-black text-primary mt-2">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <Link
                        href={`/katalog/${item.slug}`}
                        className="mt-5 w-full bg-teal-light/20 hover:bg-primary hover:text-white border border-teal-medium/30 hover:border-primary text-primary text-center py-3 rounded-full text-xs font-semibold transition-all duration-200 block shadow-xs"
                      >
                        Lihat Detail Produk
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  {/* Prev Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all bg-white border-teal-light/60 text-primary hover:bg-teal-light/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icon path={mdiChevronLeft} size={0.8} />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Number Buttons */}
                  {getPageNumbers().map((page, idx) => (
                    typeof page === "number" ? (
                      <button
                        key={idx}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-xl text-xs font-medium transition-all border ${
                          currentPage === page
                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                            : "bg-white text-slate-700 border-teal-light/60 hover:bg-teal-light/20 hover:text-primary"
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={idx} className="px-2 text-xs font-bold text-slate-400">
                        {page}
                      </span>
                    )
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all bg-white border-teal-light/60 text-primary hover:bg-teal-light/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <Icon path={mdiChevronRight} size={0.8} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Bottom Bar Kontak WA khusus Mobile Handphone */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-teal-light/40 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <a
          href={`https://wa.me/${formattedPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-primary hover:bg-[#2b7773] active:scale-98 text-white font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all shadow-md shadow-primary/20"
        >
          <Icon path={mdiWhatsapp} size={0.9} />
          <span>Hubungi Pemilik via WA</span>
        </a>
      </div>
    </div>
  );
}