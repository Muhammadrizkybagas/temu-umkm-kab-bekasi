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
  mdiTag, 
  mdiShareVariant,
  mdiCheckCircle,
  mdiShieldCheck,
  mdiTrendingUp,
  mdiOpenInNew
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
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-28 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-gray-400 font-medium text-sm">Menyiapkan detail produk terbaik...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Icon path={mdiImageOffOutline} size={1.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Produk Tidak Ditemukan</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Produk dengan tautan &quot;{slug}&quot; mungkin sudah dihapus atau tidak tersedia di etalase Portal UMKM Bekasi.
          </p>
          <div className="pt-2">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <Icon path={mdiArrowLeft} size={0.7} />
              Kembali ke Katalog UMKM
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
    `Halo *${product.umkmName}*, saya tertarik untuk memesan produk *${product.name}* (Rp ${product.price.toLocaleString("id-ID")}) yang terdaftar di Portal UMKM Bekasi.`
  );

  const waUrl = `https://wa.me/${formattedPhone}?text=${waText}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="text-xs text-gray-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/katalog" className="hover:text-primary transition-colors font-semibold">
            Katalog
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500 font-medium">{product.categoryName || "Umum"}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold truncate max-w-45 sm:max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-all border border-gray-200/60 shrink-0"
        >
          {copied ? (
            <>
              <Icon path={mdiCheckCircle} size={0.65} className="text-emerald-500" />
              <span className="text-emerald-600">Tautan Berhasil Disalin!</span>
            </>
          ) : (
            <>
              <Icon path={mdiShareVariant} size={0.65} className="text-gray-500" />
              <span>Bagikan Produk</span>
            </>
          )}
        </button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/*foto produk */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 aspect-square overflow-hidden shadow-md flex items-center justify-center relative group">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 text-xs">
                <Icon path={mdiImageOffOutline} size={2.5} className="text-gray-300 mb-2" />
                <span className="font-semibold text-gray-400">Tanpa Foto Produk</span>
              </div>
            )}
            
            
            <div className="absolute top-4 left-4">
              <span className="bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                {product.categoryName || "Umum"}
              </span>
            </div>
          </div>
        </div>

        {/* detail info kanan */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* judul & harga */}
            <div className="space-y-3 border-b border-gray-100 pb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <div className="inline-flex items-baseline gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* info lokasi umkm */}
            <div className="bg-gray-50/80 p-5 sm:p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                    <Icon path={mdiStorefront} size={0.6} className="text-primary" />
                    Pelaku UMKM
                  </span>
                  <Link
                    href={`/umkm/${product.umkmId}`}
                    className="font-extrabold text-base text-gray-900 hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span>{product.umkmName}</span>
                    <Icon path={mdiOpenInNew} size={0.6} className="text-gray-400 group-hover:text-primary transition-colors" />
                  </Link>
                </div>

                {/* status*/}
                <div className="flex items-center gap-1.5">
                  {product.status && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                      <Icon path={mdiShieldCheck} size={0.55} />
                      {product.status}
                    </span>
                  )}
                  {product.isNaikKelas && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                      <Icon path={mdiTrendingUp} size={0.55} />
                      Naik Kelas
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-200/60 text-xs">
                <div className="space-y-0.5">
                  <span className="text-gray-400 font-semibold block">Pemilik Usaha:</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <Icon path={mdiAccount} size={0.55} className="text-gray-400" />
                    {product.ownerName || "Tidak disebutkan"}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-gray-400 font-semibold block">Wilayah / Lokasi:</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1 truncate">
                    <Icon path={mdiMapMarker} size={0.55} className="text-primary shrink-0" />
                    <span className="truncate">{product.village ? `${product.village}, ` : ""}Kec. {product.district}</span>
                  </span>
                </div>
              </div>

              {product.address && (
                <div className="pt-2 border-t border-gray-200/40 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-600">Alamat Lengkap:</span> {product.address}
                </div>
              )}
            </div>


            {/* deskripsi */}
            <div className="space-y-2.5">
              <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                <Icon path={mdiTag} size={0.65} className="text-primary" />
                Deskripsi Produk
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 rounded-2xl border border-gray-100 p-4 sm:p-5">
                {product.description || "Belum ada deskripsi rinci untuk produk ini. Silakan hubungi langsung pelaku UMKM melalui tombol WhatsApp di bawah untuk informasi pemesanan, ketersediaan stok, atau detail produk lainnya."}
              </div>
            </div>


            {/* cta whatsapp */}
            <div className="pt-4 space-y-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-emerald-600 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-emerald-500/20 transition-all text-sm group"
              >
                <Icon path={mdiWhatsapp} size={1} className="group-hover:scale-110 transition-transform" />
                <span>Pesan Langsung via WhatsApp</span>
              </a>
              <p className="text-center text-[11px] text-gray-400">
                * Tautan akan mengarahkan Anda langsung ke aplikasi WhatsApp resmi penjual.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}