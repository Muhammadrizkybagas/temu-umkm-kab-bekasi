"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import { 
  mdiMagnify, 
  mdiTrendingUp, 
  mdiHandshake, 
  mdiImageOffOutline,
  mdiWhatsapp,
  mdiFilterVariant,
  mdiBookOpenPageVariant,
  mdiMapMarker,
  mdiClose
} from "@mdi/js";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductCatalog {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  imageUrl?: string;
  umkmName: string;
  phone: string;
  district: string;
  categoryId?: string;
  categoryName: string;
  isNaikKelas?: boolean;
  status?: string;
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const districtParam = searchParams.get("district") || "";

  const [products, setProducts] = useState<ProductCatalog[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(districtParam);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Hitung data untuk halaman aktif
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setSelectedDistrict(districtParam);
  }, [districtParam]);


  useEffect(() => {
    fetch("/api/public/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCategoriesList(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  
  const fetchProducts = (query = "", categoryId = "", district = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (categoryId) params.append("category", categoryId);
    if (district) params.append("district", district);

    fetch(`/api/public/catalog?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data katalog");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Catalog fetch error:", err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts(search, selectedCategory, selectedDistrict);
  }, [selectedCategory, selectedDistrict]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(search, selectedCategory, selectedDistrict);
  };

  const handleResetDistrict = () => {
    setSelectedDistrict("");
    router.push("/katalog");
  };

  const getWaLink = (phone: string, productName: string) => {
    const formattedPhone = phone?.startsWith("0") ? `62${phone.slice(1)}` : phone;
    const text = encodeURIComponent(
      `Halo, saya tertarik dengan produk *${productName}* di Katalog Digital UMKM Bekasi.`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-xs mb-10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-3 max-w-2xl">
              <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-3.5 py-1 rounded-full">
                E-Katalog UMKM Bekasi
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Temukan Produk Lokal Unggulan
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                Dukung pertumbuhan ekonomi lokal dengan membeli produk resmi langsung dari para pelaku UMKM Kabupaten Bekasi.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/katalog/ebook"
                target="_blank"
                className="group flex items-center gap-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-6 py-3.5 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="p-2 bg-white/20 rounded-full">
                  <Icon path={mdiBookOpenPageVariant} size={1} />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-100">Dokumen Digital</span>
                  <span className="block text-sm">Buka E-Book Katalog</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* banner */}
        {selectedDistrict && (
          <div className="max-w-3xl mx-auto mb-8 bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4 md:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5 text-primary w-full sm:w-auto">
              <div className="p-2.5 bg-white shadow-xs rounded-2xl shrink-0 text-primary">
                <Icon path={mdiMapMarker} size={1} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary/70 block">
                  Filter Wilayah Aktif
                </span>
                <span className="font-extrabold text-base md:text-lg text-gray-900">
                  Kecamatan {selectedDistrict}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleResetDistrict}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-full shadow-xs transition-all hover:border-gray-300 border border-gray-200"
            >
              <Icon path={mdiClose} size={0.75} className="text-gray-500" />
              <span>Tampilkan Semua Wilayah</span>
            </button>
          </div>
        )}

        {/* cari */}
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 bg-white p-2.5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200/80 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <div className="relative flex-1 flex items-center px-3.5">
              <Icon path={mdiMagnify} size={1} className="text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Cari produk, UMKM, atau kecamatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm md:text-base text-gray-800 bg-transparent outline-none py-2 placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md active:scale-95 shrink-0"
            >
              Cari Produk
            </button>
          </form>
        </div>

        {/* filter kategori */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs md:text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Icon path={mdiFilterVariant} size={0.8} className="text-primary" />
              Filter Kategori Produk
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-1 rounded-full"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border shadow-xs ${
                selectedCategory === ""
                  ? "bg-primary text-white border-primary shadow-primary/20 scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:bg-gray-50/50"
              }`}
            >
              Semua Kategori
            </button>

            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.id || selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isActive ? "" : cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-200 border shadow-xs ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-primary/20 scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:bg-gray-50/50"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* grid katalog */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl h-96 border border-gray-100 shadow-xs" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 space-y-3 shadow-xs">
            <p className="text-gray-500 font-medium text-sm md:text-base">Produk tidak ditemukan untuk kriteria ini.</p>
            {selectedDistrict && (
              <button 
                onClick={handleResetDistrict}
                className="text-xs text-primary font-bold hover:underline inline-block bg-primary/5 px-4 py-2 rounded-xl"
              >
                Tampilkan semua produk dari seluruh kecamatan
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 px-1 border-b border-gray-100 pb-4 gap-2">
              <span className="font-medium">
                Menampilkan <span className="font-bold text-gray-800">{startIndex + 1}</span> - <span className="font-bold text-gray-800">{Math.min(startIndex + ITEMS_PER_PAGE, products.length)}</span> dari total <span className="font-bold text-gray-800">{products.length}</span> produk
              </span>
              <span className="font-reguler text-white text-[14px] bg-teal-600 px-3.5 py-1.5 rounded-full border border-gray-200/50">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {currentProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                >
                  
                  <div className="w-full aspect-4/3 bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 text-xs">
                        <Icon path={mdiImageOffOutline} size={1.8} className="text-gray-300 mb-1" />
                        <span className="font-semibold text-gray-400">Tanpa Foto</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 justify-start pointer-events-none">
                      {item.status === "Bermitra" && (
                        <span className="inline-flex items-center gap-1 bg-primary/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                          <Icon path={mdiHandshake} size={0.55} />
                          Bermitra
                        </span>
                      )}
                      {item.isNaikKelas && (
                        <span className="inline-flex items-center gap-1 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                          <Icon path={mdiTrendingUp} size={0.55} />
                          Naik Kelas
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider border border-white/20">
                        {item.categoryName || "Umum"}
                      </span>
                    </div>
                  </div>

                  {/* detail */}
                  <div className="p-5 md:p-6 flex flex-col grow justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-gray-900 text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        Oleh <span className="font-semibold text-gray-700">{item.umkmName}</span>
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 pt-0.5">
                        <Icon path={mdiMapMarker} size={0.55} className="text-primary shrink-0" />
                        <span className="truncate">{item.district}</span>
                      </p>
                    </div>

                    {/* harga dan button */}
                    <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 block">Harga Produk</span>
                        <span className="font-bold text-lg text-teal-700">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/katalog/${item.slug}`}
                          className="text-center py-2.5 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-medium rounded-full transition-all"
                        >
                          Detail
                        </Link>
                        <a
                          href={getWaLink(item.phone, item.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 py-2.5 px-2.5 bg-primary hover:bg-emerald-600 text-white text-[13px] font-medium rounded-full transition-all shadow-sm hover:shadow"
                        >
                          <Icon path={mdiWhatsapp} size={0.75} />
                          Beli
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (() => {
              const getPageNumbers = () => {
                const pages: (number | string)[] = [];
                const maxPagesToShow = 3; 

                if (totalPages <= maxPagesToShow) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  let start = Math.max(1, currentPage - 1);
                  let end = Math.min(totalPages, currentPage + 1);

                  if (currentPage === 1) {
                    end = 3;
                  } else if (currentPage === totalPages) {
                    start = totalPages - 2;
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                }
                return pages;
              };

              return (
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-gray-500 font-medium">
                    Halaman <span className="font-bold text-gray-800">{currentPage}</span> dari <span className="font-bold text-gray-800">{totalPages}</span>
                  </p>
                  
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 sm:pb-0">
                    <button
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      Prev
                    </button>

                    {getPageNumbers().map((page, index) => {
                      if (page === "...") {
                        return (
                          <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-xs font-bold text-gray-400">
                            ...
                          </span>
                        );
                      }

                      const pageNum = page as number;
                      const isCurrent = currentPage === pageNum;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-xs ${
                            isCurrent
                              ? "bg-primary text-white shadow-primary/20 scale-105"
                              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        )}
        
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat Katalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}