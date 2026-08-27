"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

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

  useEffect(() => {
    fetch(`/api/public/umkm/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400">Memuat profil UMKM...</div>;
  }

  if (!data || (data as any).error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-xl font-bold text-textMain mb-2">UMKM Tidak Ditemukan</h2>
        <Link href="/katalog" className="text-primary hover:underline text-sm">
          ← Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const formattedPhone = data.phone.startsWith("0")
    ? `62${data.phone.slice(1)}`
    : data.phone;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Profil UMKM */}
      <div className="bg-secondary rounded-2xl border border-gray-100 p-8 shadow-soft mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-2xl shrink-0 overflow-hidden">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              data.name.charAt(0)
            )}
          </div>

          <div className="flex-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Pelaku Usaha Kab. Bekasi
            </span>
            <h1 className="text-3xl font-extrabold text-textMain mt-1">{data.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Pemilik: <span className="font-semibold text-textMain">{data.ownerName}</span>
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-4">
              <div className="flex items-center gap-1 bg-surface px-3 py-1.5 rounded-lg border border-gray-100">
                Desa {data.village}, Kec. {data.district}
              </div>
              <div className="flex items-center gap-1 bg-surface px-3 py-1.5 rounded-lg border border-gray-100">
                {data.address}
              </div>
            </div>
          </div>

          <div>
            <a
              href={`https://wa.me/${formattedPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 text-sm transition-all shadow-soft"
            >
              Hubungi Pemilik via WA
            </a>
          </div>
        </div>

        {data.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-textMain mb-2">Tentang Usaha</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{data.description}</p>
          </div>
        )}
      </div>


      <div>
        <h2 className="text-xl font-bold text-textMain mb-6">
          Katalog Produk dari {data.name} ({data.products.length})
        </h2>

        {data.products.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-surface rounded-2xl border border-gray-100">
            UMKM ini belum mempublikasikan produk.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.products.map((item) => (
              <div
                key={item.id}
                className="bg-secondary rounded-2xl border border-gray-100 shadow-soft p-5 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                    {item.categoryName || "Umum"}
                  </div>
                  <Link href={`/katalog/${item.slug}`} className="block hover:text-primary transition-colors">
                    <h3 className="font-bold text-textMain text-base mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="text-lg font-extrabold text-primary mb-4">
                    Rp {item.price.toLocaleString("id-ID")}
                  </div>
                </div>

                <Link
                  href={`/katalog/${item.slug}`}
                  className="w-full bg-surface border border-gray-200 hover:border-primary text-textMain text-center py-2.5 rounded-xl text-xs font-medium transition-all"
                >
                  Lihat Detail Produk
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}