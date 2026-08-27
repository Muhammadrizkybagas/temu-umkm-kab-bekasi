import Link from "next/link";
import { db } from "@/db";
import { umkm, news, banners, products, categories as categoriesTable } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import Icon from "@mdi/react";
import { 
  mdiEyeOutline, 
  mdiHeartOutline, 
  mdiHandshake, 
  mdiImageOffOutline,
  mdiTrendingUp,
  mdiArrowRight,
  mdiDomain,
  mdiPackageVariantClosed,
  mdiWhatsapp,
  mdiStorefrontOutline,
  mdiShieldCheckOutline,
  mdiBullhornOutline,
  mdiScaleBalance,
  mdiSchoolOutline
} from "@mdi/js";
import BannerCarousel from "@/components/BannerCarousel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // FETCH KPI STATS
  const [{ value: totalUmkm }] = await db.select({ value: count() }).from(umkm);
  const [{ value: totalProducts }] = await db.select({ value: count() }).from(products);
  const [{ value: totalNaikKelas }] = await db
    .select({ value: count() })
    .from(umkm)
    .where(eq(umkm.isNaikKelas, true));
  const [{ value: totalBermitra }] = await db
    .select({ value: count() })
    .from(umkm)
    .where(eq(umkm.status, "Bermitra"));

  const stats = [
    { title: "Total UMKM Terdaftar", value: totalUmkm, icon: mdiDomain },
    { title: "Total Katalog Produk", value: totalProducts, icon: mdiPackageVariantClosed },
    { title: "UMKM Naik Kelas", value: totalNaikKelas, icon: mdiTrendingUp },
    { title: "UMKM Bermitra", value: totalBermitra, icon: mdiHandshake },
  ];



  // FETCH BANNER AKTIF
  const activeBanners = await db
    .select()
    .from(banners)
    .where(eq(banners.isActive, 1))
    .orderBy(desc(banners.order));



  // FETCH PRODUK BERMITRA 
  const produkBermitra = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      category: categoriesTable.name,
      price: products.price,
      imageUrl: products.imageUrl,
      umkmName: umkm.name,
      district: umkm.district,
      whatsapp: umkm.phone,
      umkmStatus: umkm.status,
    })
    .from(products)
    .innerJoin(umkm, eq(products.umkmId, umkm.id))
    .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
    .where(eq(umkm.status, "Bermitra"))
    .orderBy(desc(products.createdAt))
    .limit(10);

  // FETCH PRODUK NAIK KELAS
  const produkNaikKelas = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      category: categoriesTable.name,
      price: products.price,
      imageUrl: products.imageUrl,
      umkmName: umkm.name,
      district: umkm.district,
      whatsapp: umkm.phone,
      isNaikKelas: umkm.isNaikKelas,
    })
    .from(products)
    .innerJoin(umkm, eq(products.umkmId, umkm.id))
    .leftJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
    .where(eq(umkm.status, "Bermitra"))
    .orderBy(desc(products.createdAt))
    .limit(10);

  // FETCH BERITA TERBARU
  const beritaTerbaru = await db
    .select()
    .from(news)
    .where(eq(news.status, "Published"))
    .orderBy(desc(news.createdAt))
    .limit(6);

  // format Rupiah
  const formatRupiah = (val: number | null) => {
    if (!val) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  // format tanggal
  const formatDate = (dateValue: string | number | Date | null) => {
    if (!dateValue) return "-";
    const date = new Date(typeof dateValue === "number" ? dateValue * 1000 : dateValue);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  // Kategori Produk
  // const categories = [
  //   { name: "Kuliner", count: "1.2k+ Produk" },
  //   { name: "Fashion", count: "800+ Produk" },
  //   { name: "Kerajinan", count: "450+ Produk" },
  //   { name: "Kecantikan", count: "300+ Produk" },
  //   { name: "Pertanian", count: "250+ Produk" },
  //   { name: "Jasa", count: "400+ Produk" },
  // ];

  return (
    <div className="bg-surface min-h-screen">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* BANNER */}
      {activeBanners.length > 0 && <BannerCarousel banners={activeBanners} />}



      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-teal-light/30 via-surface to-white py-20 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-primary font-bold text-xs tracking-wider border border-teal-light shadow-2xs">
              PORTAL RESMI DINAS KOPERASI & UMKM KABUPATEN BEKASI
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-md text-primary font-semibold text-xs border border-primary/20 shadow-2xs">
              <Icon path={mdiSchoolOutline} size={0.65} />
              <span>Kolaborasi Prodi Sains Data ITSB</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
            Direktori Digital UMKM <br />
            <span className="bg-linear-to-r from-primary to-teal-medium bg-clip-text text-transparent">
              Kabupaten Bekasi
            </span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Pusat katalog digital terpadu berbasis data untuk mempromosikan produk unggulan daerah dan mendorong akselerasi Usaha Mikro, Kecil, dan Menengah.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/katalog"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-sm transform hover:-translate-y-0.5"
            >
              <span>Jelajahi Katalog Produk</span>
              <Icon path={mdiArrowRight} size={0.7} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/tentang"
              className="bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 hover:border-primary hover:text-primary font-semibold px-8 py-3.5 rounded-full shadow-2xs hover:shadow-xs transition-all text-sm"
            >
              Tentang Portal
            </Link>
          </div>

          {/* <div className="pt-6 border-t border-gray-200/60 max-w-lg mx-auto">
            <p className="text-xs text-gray-500 font-medium">
              Inovasi digital ini dikembangkan atas kerja sama strategis antara <strong className="text-gray-700">Dinas KOPERASI & UMKM Kab. Bekasi</strong> dengan <strong className="text-gray-700">Program Studi Sains Data Institut Teknologi Science dan Bandung (ITSB)</strong>.
            </p>
          </div> */}

        </div>
      </section>



      {/* KPI SECTION */}
      <section className="relative py-12 bg-white border-y border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group relative bg-surface hover:bg-white p-6 rounded-3xl border border-gray-100/90 shadow-2xs hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-teal-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-teal-light/70 to-teal-light/20 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon path={stat.icon} size={1.2} />
                  </div>

                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-light/40 text-primary border border-teal-light/60">
                    Live Data
                  </span>
                </div>

                <div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">
                    {stat.value.toLocaleString("id-ID")}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                    {stat.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* <section className="py-14 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-primary font-bold text-xs tracking-widest uppercase">Kategori Produk</span>
          <h2 className="text-3xl font-extrabold text-gray-800">Cari Berdasarkan Kategori</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/katalog?category=${cat.name}`}
              className="bg-white p-5 rounded-3xl border border-gray-100 hover:border-primary text-center space-y-2 group shadow-2xs hover:shadow-md transition-all"
            >
              <div className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</div>
              <div className="font-bold text-sm text-gray-800 group-hover:text-primary transition-colors">{cat.name}</div>
              <div className="text-[11px] text-gray-400 font-medium">{cat.count}</div>
            </Link>
          ))}
        </div>
      </section> */}



      {/* PRODUK UMKM BERMITRA */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <span className="text-primary font-bold text-xs tracking-widest uppercase">Kualitas Terjamin</span>
            <h2 className="text-3xl font-extrabold text-gray-800">Produk UMKM Bermitra</h2>
            <p className="text-gray-500 text-sm max-w-xl">
              Koleksi produk resmi dari UMKM yang telah terverifikasi dan secara aktif bermitra dengan Pemerintah Kabupaten Bekasi.
            </p>
          </div>
          <Link
            href="/katalog"
            className="text-primary font-semibold hover:text-primary-hover transition-colors flex items-center gap-1.5 text-sm group"
          >
            <span>Lihat Semua Katalog</span>
            <Icon path={mdiArrowRight} size={0.7} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full overflow-hidden">
            {produkBermitra.length > 0 ? (
              <div className="animate-marquee gap-6">
                {[...produkBermitra, ...produkBermitra].map((prod, idx) => (
                  <div
                    key={`bermitra-${prod.id}-${idx}`}
                    className="w-72 sm:w-80 bg-surface rounded-3xl overflow-hidden shadow-2xs border border-gray-100 hover:shadow-md transition-all group flex flex-col"
                  >
                    <div className="aspect-4/3 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-medium gap-1">
                          <Icon path={mdiImageOffOutline} size={1.2} />
                          <span>Tanpa Foto</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
                        <Icon path={mdiHandshake} size={0.6} />
                        Bermitra
                      </div>
                    </div>

                    <div className="p-5 flex flex-col grow">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                        {prod.category || "Umum"}
                      </span>
                      <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {prod.name}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <Icon path={mdiStorefrontOutline} size={0.65} className="text-gray-400 shrink-0" />
                        <span className="line-clamp-1 font-medium">{prod.umkmName}</span>
                      </div>

                      <div className="mt-auto pt-3 border-t border-gray-200/50 space-y-3">
                        <div>
                          <span className="text-[10px] text-gray-400 font-medium block">Harga</span>
                          <span className="text-base font-extrabold text-gray-900">{formatRupiah(prod.price)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/katalog/${prod.slug ?? prod.id}`}
                            className="w-full py-2 px-3 bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary rounded-full text-xs font-semibold text-center transition-all"
                          >
                            Detail
                          </Link>
                          {prod.whatsapp ? (
                            <a
                              href={`https://wa.me/${prod.whatsapp}?text=Halo%20${encodeURIComponent(prod.umkmName)},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(prod.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2 px-3 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                            >
                              <Icon path={mdiWhatsapp} size={0.65} />
                              <span>Beli</span>
                            </a>
                          ) : (
                            <button disabled className="w-full py-2 px-3 bg-gray-200 text-gray-400 rounded-full text-xs font-semibold text-center cursor-not-allowed">
                              Beli
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">Belum ada produk UMKM Bermitra.</div>
            )}
          </div>
        </div>
      </section>



      {/* PRODUK NAIK KELAS */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <span className="text-teal-medium font-bold text-xs tracking-widest uppercase">Akselerasi Usaha</span>
            <h2 className="text-3xl font-extrabold text-gray-800">Produk UMKM Naik Kelas</h2>
            <p className="text-gray-500 text-sm max-w-xl">
              Jajaran produk unggulan dari pelaku UMKM yang telah berhasil meningkatkan standar mutu dan sertifikasi usaha.
            </p>
          </div>
          <Link
            href="/katalog"
            className="text-primary font-semibold hover:text-primary-hover transition-colors flex items-center gap-1.5 text-sm group"
          >
            <span>Lihat Semua Katalog</span>
            <Icon path={mdiArrowRight} size={0.7} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full overflow-hidden">
            {produkNaikKelas.length > 0 ? (
              <div className="animate-marquee gap-6">
                {[...produkNaikKelas, ...produkNaikKelas].map((prod, idx) => (
                  <div
                    key={`naikkelas-${prod.id}-${idx}`}
                    className="w-72 sm:w-80 bg-white rounded-3xl overflow-hidden shadow-2xs border border-gray-100 hover:shadow-md transition-all group flex flex-col"
                  >
                    <div className="aspect-4/3 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-medium gap-1">
                          <Icon path={mdiImageOffOutline} size={1.2} />
                          <span>Tanpa Foto</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-teal-medium text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
                        <Icon path={mdiTrendingUp} size={0.6} />
                        Naik Kelas
                      </div>
                    </div>

                    <div className="p-5 flex flex-col grow">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-medium mb-1">
                        {prod.category || "Umum"}
                      </span>
                      <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {prod.name}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <Icon path={mdiStorefrontOutline} size={0.65} className="text-gray-400 shrink-0" />
                        <span className="line-clamp-1 font-medium">{prod.umkmName}</span>
                      </div>

                      <div className="mt-auto pt-3 border-t border-gray-100 space-y-3">
                        <div>
                          <span className="text-[10px] text-gray-400 font-medium block">Harga</span>
                          <span className="text-base font-extrabold text-gray-900">{formatRupiah(prod.price)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/katalog/${prod.slug ?? prod.id}`}
                            className="w-full py-2 px-3 bg-surface border border-gray-200 text-gray-700 hover:border-primary hover:text-primary rounded-full text-xs font-semibold text-center transition-all"
                          >
                            Detail
                          </Link>
                          {prod.whatsapp ? (
                            <a
                              href={`https://wa.me/${prod.whatsapp}?text=Halo%20${encodeURIComponent(prod.umkmName)},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(prod.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2 px-3 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                            >
                              <Icon path={mdiWhatsapp} size={0.65} />
                              <span>Beli</span>
                            </a>
                          ) : (
                            <button disabled className="w-full py-2 px-3 bg-gray-200 text-gray-400 rounded-full text-xs font-semibold text-center cursor-not-allowed">
                              Beli
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">Belum ada produk UMKM Naik Kelas.</div>
            )}
          </div>
        </div>
      </section>



      {/* KOMITMEN KAMI */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-teal-light/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center space-y-3 mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-light/40 text-primary font-bold text-xs tracking-widest uppercase border border-teal-light/60">
            Komitmen Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Mengapa Memilih Produk UMKM Bekasi?
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Platform resmi yang dirancang untuk memberikan rasa aman, transparansi penuh, dan dampak nyata bagi ekonomi kerakyatan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-white p-8 rounded-3xl border border-gray-100/90 shadow-2xs hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center overflow-hidden">
            <span className="absolute top-4 right-6 text-6xl font-black text-gray-100/60 select-none group-hover:text-teal-light/30 transition-colors">
              01
            </span>

            <div className="w-16 h-16 bg-linear-to-br from-teal-light/60 to-teal-light/20 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
              <Icon path={mdiShieldCheckOutline} size={1.4} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              Terverifikasi Resmi
            </h3>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Seluruh UMKM yang terdaftar di dalam platform ini dikurasi langsung secara ketat oleh Dinas Koperasi & UMKM Kabupaten Bekasi.
            </p>
          </div>

          <div className="group relative bg-white p-8 rounded-3xl border border-gray-100/90 shadow-2xs hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center overflow-hidden">
            <span className="absolute top-4 right-6 text-6xl font-black text-gray-100/60 select-none group-hover:text-teal-light/30 transition-colors">
              02
            </span>

            <div className="w-16 h-16 bg-linear-to-br from-teal-light/60 to-teal-light/20 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
              <Icon path={mdiScaleBalance} size={1.4} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              Transaksi Transparan
            </h3>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Menghubungkan pembeli langsung ke kontak resmi WhatsApp pemilik UMKM tanpa ada potongan atau perantara biaya komisi.
            </p>
          </div>

          <div className="group relative bg-white p-8 rounded-3xl border border-gray-100/90 shadow-2xs hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center overflow-hidden">
            <span className="absolute top-4 right-6 text-6xl font-black text-gray-100/60 select-none group-hover:text-teal-light/30 transition-colors">
              03
            </span>

            <div className="w-16 h-16 bg-linear-to-br from-teal-light/60 to-teal-light/20 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
              <Icon path={mdiBullhornOutline} size={1.4} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              Dukungan Ekonomi Lokal
            </h3>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Setiap pembelian produk lokal membantu memperkuat pertumbuhan ekonomi daerah serta pemberdayaan masyarakat sekitar.
            </p>
          </div>
        </div>
      </section>



      {/* BERITA*/}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <span className="text-primary font-bold text-xs tracking-widest uppercase">Kabar Terbaru</span>
            <h2 className="text-3xl font-extrabold text-gray-800">Berita & Publikasi Official</h2>
            <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
              Dapatkan informasi seputar program pelatihan, pembinaan UMKM, event pameran, dan agenda kegiatan dinas.
            </p>
          </div>
          <Link
            href="/berita"
            className="shrink-0 bg-surface border border-gray-200 text-gray-700 hover:border-primary hover:text-primary font-semibold px-6 py-2.5 rounded-full transition-all text-sm shadow-2xs flex items-center gap-2"
          >
            <span>Semua Berita</span>
            <Icon path={mdiArrowRight} size={0.7} />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full overflow-hidden relative">
            <div className="w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory">
              {beritaTerbaru.length > 0 ? (
                <div className="animate-marquee gap-6">
                  {[...beritaTerbaru, ...beritaTerbaru].map((item, idx) => (
                    <Link
                      href={`/berita/${item.slug}`}
                      key={`berita-${item.id}-${idx}`}
                      className="snap-start shrink-0 w-75 md:w-87.5 bg-surface rounded-3xl overflow-hidden shadow-2xs border border-gray-100 hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
                    >
                      <div className="w-full h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                        {item.thumbnailUrl ? (
                          <img 
                            src={item.thumbnailUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-1">
                            <Icon path={mdiImageOffOutline} size={1.2} />
                            <span>Tanpa Foto</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col grow">
                        <span className="text-[11px] font-bold text-primary mb-2 uppercase tracking-wider">
                          {formatDate(item.createdAt)}
                        </span>
                        <h4 className="font-bold text-base text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <div className="mt-auto flex items-center gap-4 text-xs font-semibold text-gray-500 pt-3 border-t border-gray-200/50">
                          <span className="flex items-center gap-1">
                            <Icon path={mdiEyeOutline} size={0.7} className="text-gray-400" />
                            {item.views} View
                          </span>
                          <span className="flex items-center gap-1 text-teal-medium">
                            <Icon path={mdiHeartOutline} size={0.7} className="text-teal-medium" />
                            {item.likes} Like
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 w-full">Belum ada berita yang diterbitkan.</div>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* CTA SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="relative bg-linear-to-br from-primary via-primary-hover to-teal-medium rounded-3xl p-10 md:p-16 text-white text-center space-y-6 overflow-hidden shadow-xl">
          
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-semibold text-xs tracking-wider uppercase border border-white/20">
              Gerakan Bangga Produk Lokal
            </span>
          </div>

          <h2 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-2xl mx-auto">
            Dukung UMKM Lokal Kabupaten Bekasi Bersama Kami
          </h2>

          <p className="relative z-10 text-white/90 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-normal">
            Temukan aneka pilihan produk khas Bekasi terbaik, mulai dari kuliner hingga kerajinan, dan hubungi penjualnya secara langsung tanpa perantara.
          </p>

          <div className="relative z-10 pt-2">
            <Link
              href="/katalog"
              className="group inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full shadow-lg hover:bg-teal-light transition-all text-sm transform hover:-translate-y-0.5 hover:scale-105"
            >
              <span>Mulai Cari Produk</span>
              <Icon path={mdiArrowRight} size={0.7} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}