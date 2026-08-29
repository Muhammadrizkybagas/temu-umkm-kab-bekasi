"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import { 
  mdiArrowLeft, 
  mdiWhatsapp, 
  mdiStorefront, 
  mdiAccount, 
  mdiMapMarker, 
  mdiImageOffOutline, 
  mdiTagOutline, 
  mdiShareVariantOutline,
  mdiCheckCircleOutline,
  mdiShieldCheckOutline,
  mdiTrendingUp,
  mdiOpenInNew,
  mdiHomeVariantOutline
} from "@mdi/js";

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  umkmId: string;
  umkmName: string;
  ownerName: string;
  phone: string;
  district: string;
  village: string;
  address: string;
  categoryName: string;
  status?: string;
  isNaikKelas?: boolean;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/public/products/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal memuat produk");
        const data = await res.json();
        setProduct(data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-linear-to-br from-white to-teal-light/20 p-6">
        <div className="w-12 h-12 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-primary tracking-wide animate-pulse">
          Merangkai detail produk...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-linear-to-br from-white to-teal-light/10">
        <div className="max-w-md w-full p-10 text-center bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-teal-light/40 shadow-2xl shadow-primary/5 space-y-5">
          <div className="w-20 h-20 bg-rose-50 text-rose-400 rounded-3xl rotate-3 flex items-center justify-center mx-auto transition-transform hover:rotate-0">
            <Icon path={mdiImageOffOutline} size={2} />
          </div>
          <h2 className="text-xl font-semibold text-slate-700">Produk Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Produk dengan tautan &quot;{slug}&quot; mungkin sudah dihapus atau ditarik dari etalase.
          </p>
          <div className="pt-4">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 bg-primary hover:bg-[#2b7773] text-white px-7 py-3.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <Icon path={mdiArrowLeft} size={0.7} />
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedPhone = product.phone
    ? product.phone.startsWith("0")
      ? `62${product.phone.slice(1)}`
      : product.phone
    : "";

  const waText = encodeURIComponent(
    `Halo *${product.umkmName}*, saya tertarik memesan *${product.name}* (Rp ${product.price.toLocaleString("id-ID")}) dari Portal TEMU UMKM.`
  );

  const waUrl = `https://wa.me/${formattedPhone}?text=${waText}`;

  return (
    <div className="bg-linear-to-br from-[#FFFFFF] via-[#FFFFFF] to-teal-light/15 min-h-screen pb-24 text-slate-700 selection:bg-teal-light selection:text-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">


        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-lg px-6 py-4 rounded-full border border-teal-light/40 shadow-sm">
          <div className="text-xs text-slate-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {/* <Link href="/" className="hover:text-primary transition-colors font-medium flex items-center gap-1.5">
              <Icon path={mdiHomeVariantOutline} size={0.65} className="text-primary" />
              Beranda
            </Link>
            <span className="text-slate-300">/</span> */}
            <Link href="/katalog" className="hover:text-primary transition-colors font-medium">
              Katalog
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-teal-medium font-medium">{product.categoryName || "Umum"}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold truncate max-w-30 sm:max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFFFFF] hover:bg-teal-light/20 text-primary text-xs font-medium rounded-full transition-all border border-teal-medium/30 shrink-0 shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Icon path={mdiCheckCircleOutline} size={0.7} className="text-primary" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Icon path={mdiShareVariantOutline} size={0.7} className="text-primary" />
                <span>Bagikan</span>
              </>
            )}
          </button>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          
          {/* Image Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-12 z-10">
            <div className="relative group">
              
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-teal-light/40 rounded-[3rem] -rotate-3 scale-[1.02] transition-transform group-hover:rotate-0 duration-500 -z-10 blur-sm"></div>
              
              <div className="bg-white rounded-[3rem] rounded-br-3xl border border-white aspect-4/5 overflow-hidden shadow-xl shadow-primary/10 flex items-center justify-center relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="flex flex-col items-center text-teal-medium text-sm bg-linear-to-b from-teal-light/5 to-teal-light/20 w-full h-full justify-center">
                    <Icon path={mdiImageOffOutline} size={3} className="text-teal-light mb-3 opacity-70" />
                    <span className="font-medium text-teal-medium">Gambar tidak tersedia</span>
                  </div>
                )}
                
                
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-primary text-xs font-semibold px-4 py-2 rounded-full shadow-sm border border-white/50 tracking-wide">
                    {product.categoryName || "Umum"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-7 space-y-8 pt-2 lg:pt-8">
            <div className="space-y-6">
              {/* Judul dan harga */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-snug tracking-tight">
                  {product.name}
                </h1>
                <div className="inline-block">
                  <div className="flex items-center gap-3 bg-linear-to-r from-primary/10 to-transparent pr-8 py-2 rounded-l-2xl border-l-4 border-primary">
                    <span className="text-2xl sm:text-3xl font-semibold text-primary pl-4">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* UMKM Card */}
              <div className="bg-white/50 backdrop-blur-sm p-6 sm:p-7 rounded-4xl border border-teal-light/30 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-light/30 flex items-center justify-center shrink-0">
                      <Icon path={mdiStorefront} size={1} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium tracking-widest text-teal-600 uppercase mb-0.5">Dikelola Oleh</p>
                      <Link
                        href={`/umkm/${product.umkmId}`}
                        className="font-semibold text-lg text-slate-700 hover:text-primary transition-colors flex items-center gap-1.5 group"
                      >
                        {product.umkmName}
                        <Icon path={mdiOpenInNew} size={0.65} className="text-teal-600 group-hover:text-primary transition-colors" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {product.status && (
                      <span className="inline-flex items-center gap-1.5 bg-primary/5 text-primary border border-primary/10 text-xs font-medium px-3 py-1.5 rounded-full">
                        <Icon path={mdiShieldCheckOutline} size={0.6} />
                        {product.status}
                      </span>
                    )}
                    {product.isNaikKelas && (
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-100 text-xs font-medium px-3 py-1.5 rounded-full">
                        <Icon path={mdiTrendingUp} size={0.6} />
                        Naik Kelas
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100/80 text-sm">
                  <div className="flex items-start gap-2.5">
                    <Icon path={mdiAccount} size={0.7} className="text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Pemilik Usaha</p>
                      <p className="font-medium text-slate-700">{product.ownerName || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Icon path={mdiMapMarker} size={0.7} className="text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Wilayah</p>
                      <p className="font-medium text-slate-700 leading-snug">
                        {product.village ? `${product.village}, ` : ""}Kec. {product.district}
                      </p>
                    </div>
                  </div>
                </div>

                {product.address && (
                  <div className="pt-2 text-xs text-slate-500 leading-relaxed bg-white/40 p-3 rounded-xl border border-white">
                    <span className="font-medium text-slate-600">Alamat:</span> {product.address}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2 mb-4">
                  <Icon path={mdiTagOutline} size={0.7} className="text-primary" />
                  Detail Produk
                </h3>
                <div className="text-sm text-slate-600 leading-loose bg-transparent">
                  {product.description || (
                    <span className="italic text-slate-400">Deskripsi belum ditambahkan oleh pemilik usaha. Silakan hubungi via WhatsApp untuk informasi lebih lanjut.</span>
                  )}
                </div>
              </div>

              {/* CTA Desktop */}
              <div className="pt-6 hidden sm:block">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-linear-to-r from-primary to-[#2a736f] hover:shadow-lg hover:shadow-primary/25 text-white font-medium py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon path={mdiWhatsapp} size={1} />
                  <span>Hubungi Penjual</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>


      <div className="sm:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-white p-2 rounded-full shadow-2xl shadow-primary/20">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary text-white font-medium py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 text-sm transition-transform active:scale-95"
          >
            <Icon path={mdiWhatsapp} size={0.9} />
            <span>Pesan Sekarang</span>
          </a>
        </div>
      </div>
    </div>
  );
}