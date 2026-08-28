"use client";

import { useEffect, useState, useRef, forwardRef } from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import { 
  mdiArrowLeft, 
  mdiChevronLeft, 
  mdiChevronRight, 
  mdiBookOpenPageVariant,
  mdiImageOffOutline,
  mdiShieldCheck,
  mdiTrendingUp,
  mdiWhatsapp
} from "@mdi/js";

// @ts-ignore
import HTMLFlipBook from "react-pageflip";

interface ProductCatalog {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  umkmName: string;
  phone: string;
  district: string;
  categoryName: string;
  isNaikKelas?: boolean;
  status?: string;
}

// 4 produk 
const chunkArray = (array: ProductCatalog[], chunkSize: number) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
};

// komponen halaman buku
const Page = forwardRef<HTMLDivElement, { 
  pageNum: number; 
  productsGroup?: ProductCatalog[]; 
  isCover?: boolean; 
  isBackCover?: boolean 
}>(({ pageNum, productsGroup, isCover, isBackCover }, ref) => {

  if (isCover) {
    return (
      <div ref={ref} className="ebook-page bg-linear-to-br from-primary via-emerald-800 to-teal-950 text-white p-6 sm:p-8 flex flex-col justify-between h-full border-r border-emerald-950/40 shadow-2xl select-none box-border">
        <div className="border-2 border-white/20 p-5 h-full flex flex-col justify-between items-center text-center rounded-2xl bg-black/10 backdrop-blur-xs">
          <span className="text-[10px] font-medium tracking-widest uppercase bg-white/20 px-3.5 py-1.5 rounded-full shadow-xs">
            PEMKAB BEKASI
          </span>
          <div className="space-y-3 my-auto">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md shadow-inner">
              <Icon path={mdiBookOpenPageVariant} size={2} className="text-amber-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">E-KATALOG DIGITAL UMKM</h1>
            <p className="text-xs text-white/80 max-w-xs mx-auto font-medium">Koleksi Produk Unggulan & Komoditas Lokal Kabupaten Bekasi</p>
          </div>
          
          <div className="text-[10px] text-white/70 font-semibold border-t border-white/10 pt-3 w-full">
            Dinas Koperasi UMKM & Program Studi Sains Data ITSB
          </div>
        </div>
      </div>
    );
  }

  if (isBackCover) {
    return (
      <div ref={ref} className="ebook-page bg-linear-to-br from-teal-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between items-center text-center h-full select-none box-border shadow-2xl">
        <div />
        <div className="my-auto space-y-3">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon path={mdiShieldCheck} size={1.7} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Terima Kasih</h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            Dukung terus kemajuan Usaha Mikro Kecil dan Menengah Kabupaten Bekasi agar semakin mandiri dan naik kelas.
          </p>
        </div>
        <div className="text-[10px] text-slate-300 border-t border-slate-800 pt-3 w-full font-medium">
          Portal Resmi UMKM Kabupaten Bekasi
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="ebook-page bg-white p-4 border border-slate-100 flex flex-col justify-between h-full select-none shadow-sm box-border overflow-hidden">
      <div className="flex flex-col h-full">

        <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-100 shrink-0">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Katalog Produk Bekasi
          </span>
          <span className="text-[10px] text-slate-400 font-mono font-bold">Hal. {pageNum}</span>
        </div>

        {/* produk lembaran */}
        <div className="flex-1 flex flex-col justify-between py-1">
            {productsGroup && productsGroup.map((item) => {
                const formattedPhone = item.phone ? (item.phone.startsWith("0") ? `62${item.phone.slice(1)}` : item.phone) : "";
                const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(`Halo *${item.umkmName}*, saya tertarik memesan produk *${item.name}* dari E-Book Katalog UMKM Bekasi.`)}`;

                return (
                <div key={item.id} className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50 transition-all items-center shadow-2xs group flex-1 my-0.5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-200/60 shadow-inner">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <Icon path={mdiImageOffOutline} size={1} className="text-slate-400" />
                    )}
                    </div>

                    <div className="grow min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[9px] sm:text-[10px] font-extrabold text-primary uppercase truncate max-w-28">{item.categoryName || "Umum"}</span>
                        
                        {item.status && (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                            <Icon path={mdiShieldCheck} size={0.45} />
                            {item.status}
                        </span>
                        )}
                        {item.isNaikKelas && (
                        <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                            <Icon path={mdiTrendingUp} size={0.45} />
                            Naik Kelas
                        </span>
                        )}
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate leading-snug">{item.name}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 truncate font-medium">{item.umkmName} • Kec. {item.district}</p>
                    <p className="text-xs sm:text-sm font-black text-primary mt-0.5">Rp {item.price?.toLocaleString("id-ID")}</p>
                    </div>

                    <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="no-print shrink-0 bg-primary hover:bg-primary-600 text-white text-[10px] sm:text-xs font-medium px-3 py-1 rounded-full transition-all shadow-xs shadow-emerald-500/20 flex items-center gap-1.5"
                    title="Pesan via WhatsApp"
                    >
                    <Icon path={mdiWhatsapp} size={0.7} />
                    <span>Beli</span>
                    </a>
                </div>
                );
            })}
        </div>

        {/* wm */}
        <div className="pt-2 border-t border-slate-100 text-center shrink-0 mt-auto">
          <p className="text-[8px] text-slate-400 font-semibold tracking-tight">
            Dinas Koperasi UMKM dan Program Studi Sains Data ITSB
          </p>
        </div>
      </div>
    </div>
  );
});
Page.displayName = "Page";

export default function EbookPage() {
  const [productsGrouped, setProductsGrouped] = useState<ProductCatalog[][]>([]);
  const [loading, setLoading] = useState(true);
  const [flipKey, setFlipKey] = useState(0);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    fetch("/api/public/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductsGrouped(chunkArray(data, 4));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setFlipKey((prev) => prev + 1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#134e4a_0%,#1f2937_100%)] flex flex-col justify-between py-6 px-4 overflow-hidden relative selection:bg-teal-500 selection:text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[linear-gradient(135deg,#34908B,#6FBEB2)] opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[linear-gradient(135deg,#A5E9DD,#34908B)] opacity-15 blur-3xl pointer-events-none"></div>
      <div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-teal-light opacity-10 blur-2xl pointer-events-none"></div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body, html, main, div { background: white !important; padding: 0 !important; margin: 0 !important; }
          .ebook-page {
            display: block !important;
            width: 100vw !important;
            height: 100vh !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            border: none !important;
            box-shadow: none !important;
          }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center text-white mb-2 no-print px-2 z-10">
        <Link href="/katalog" className="flex items-center gap-2 text-xs font-medium bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-full transition-all backdrop-blur-md border border-white/10 shadow-sm">
          <Icon path={mdiArrowLeft} size={0.7} /> Kembali
        </Link>
        
        <div className="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-2xl text-xs font-medium tracking-wide backdrop-blur-md shadow-lg">
          E-BOOK KATALOG
        </div>
      </div>

      {/* buku */}
      <div className="flex-1 flex justify-center items-center my-auto py-2 w-full overflow-hidden z-10">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
            <p className="text-teal-100 text-xs font-medium">Menyusun Lembaran E-Book Terbaik...</p>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full">
            {/* @ts-ignore */}
            <HTMLFlipBook
              key={flipKey}
              width={350}
              height={520}
              size="stretch"
              minWidth={280}
              maxWidth={420}
              minHeight={400}
              maxHeight={580}
              maxShadowOpacity={0.4}
              showCover={true}
              mobileScrollSupport={true}
              className="shadow-2xl rounded-2xl mx-auto"
              ref={bookRef}
            >
              <Page pageNum={1} isCover={true} />
              {productsGrouped.map((group, idx) => (
                <Page key={idx} pageNum={idx + 2} productsGroup={group} />
              ))}
              <Page pageNum={productsGrouped.length + 2} isBackCover={true} />
            </HTMLFlipBook>
          </div>
        )}
      </div>

      {/* tombol */}
      {!loading && (
        <div className="flex justify-center items-center gap-4 mt-2 no-print z-10">
          <button
            onClick={() => bookRef.current?.pageFlip().flipPrev()}
            className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md border border-white/20 shadow-lg active:scale-95"
            title="Halaman Sebelumnya"
          >
            <Icon path={mdiChevronLeft} size={1} />
          </button>
          
          <span className="text-xs text-white font-medium px-4 py-2 bg-primary rounded-full border border-white/10 backdrop-blur-xs shadow-inner">
            Geser atau Klik Tepi Buku untuk Membalik Halaman
          </span>

          <button
            onClick={() => bookRef.current?.pageFlip().flipNext()}
            className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md border border-white/20 shadow-lg active:scale-95"
            title="Halaman Berikutnya"
          >
            <Icon path={mdiChevronRight} size={1} />
          </button>
        </div>
      )}
    </div>
  );
}