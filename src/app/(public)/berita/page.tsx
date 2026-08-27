import { db } from "@/db";
import { news } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Icon from "@mdi/react";
import { mdiNewspaperVariantOutline } from "@mdi/js";
import NewsClientList from "./NewsClientList";

export const dynamic = "force-dynamic";

export default async function DaftarBeritaPage() {
  let semuaBerita: (typeof news.$inferSelect)[] = [];
  let isError = false;

  try {
    semuaBerita = await db
      .select()
      .from(news)
      .where(eq(news.status, "Published"))
      .orderBy(desc(news.createdAt));
  } catch (error) {
    console.error("Gagal mengambil daftar berita dari database:", error);
    isError = true;
  }

  return (
    <div className="min-h-screen bg-surface py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wide uppercase">
            <Icon path={mdiNewspaperVariantOutline} size={0.75} />
            Pusat Informasi & Kabar UMKM
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Berita & Artikel Terbaru
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Temukan berita seputar perkembangan, program pembinaan, kisah inspiratif, dan pengumuman penting bagi pelaku UMKM di Kabupaten Bekasi.
          </p>
        </div>

        {isError ? (
          <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-100 max-w-xl mx-auto space-y-3">
            <h3 className="text-lg font-bold text-red-600">Gagal Memuat Berita</h3>
            <p className="text-sm text-red-500">
              Terjadi kesalahan saat menghubungkan ke server. Silakan coba muat ulang halaman beberapa saat lagi.
            </p>
          </div>
        ) : (
          <NewsClientList berita={semuaBerita} />
        )}
      </div>
    </div>
  );
}