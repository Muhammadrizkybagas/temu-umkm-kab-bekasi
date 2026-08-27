"use client";

import { useEffect, useState, use, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import {
  mdiArrowLeft,
  mdiCalendarBlankOutline,
  mdiEyeOutline,
  mdiHeartOutline,
  mdiShareVariantOutline,
  mdiImageOffOutline,
  mdiWhatsapp,
  mdiFacebook,
  mdiLinkVariant,
  mdiCheckCircle,
} from "@mdi/js";
import Swal from "sweetalert2";

interface NewsDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  views: number;
  likes: number;
  createdAt: string | number | Date;
}

export default function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [item, setItem] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/news/${slug}`);

        if (!res.ok) {
          console.error("Gagal memuat berita, status:", res.status);
          router.push("/berita");
          return;
        }

        const newsData: NewsDetail = await res.json();
        setItem(newsData);
      } catch (err) {
        console.error("Error fetching detail berita:", err);
        router.push("/berita");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDetail();
    }
  }, [slug, router]);

  const handleLike = async () => {
    if (liked || !item) return;

    setLiked(true);
    setItem((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null));

    try {
      const res = await fetch(`/api/news/${slug}`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.likes !== undefined) {
          setItem((prev) => (prev ? { ...prev, likes: data.likes } : null));
        }
        Swal.fire({
          icon: "success",
          title: "Terima kasih!",
          text: "Anda menyukai artikel ini.",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        setLiked(false);
        setItem((prev) => (prev ? { ...prev, likes: Math.max(0, prev.likes - 1) } : null));
      }
    } catch (error) {
      console.error("Gagal menyukai artikel:", error);
      setLiked(false);
      setItem((prev) => (prev ? { ...prev, likes: Math.max(0, prev.likes - 1) } : null));
    }
  };

  const handleShare = (platform: "wa" | "fb" | "native" | "copy") => {
    const url = window.location.href;
    const title = item?.title || "Berita UMKM Bekasi";

    switch (platform) {
      case "wa":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} \n\nBaca selengkapnya di: ${url}`)}`,
          "_blank"
        );
        break;
      case "fb":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "native":
        if (navigator.share) {
          navigator.share({ title, url }).catch(() => {});
        }
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        Swal.fire({
          icon: "success",
          title: "Tautan Disalin!",
          text: "Tautan berita berhasil disalin ke clipboard.",
          timer: 1500,
          showConfirmButton: false,
        });
        break;
    }
  };

  const formatDate = (dateValue: string | number | Date | null) => {
    if (!dateValue) return "-";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        <p className="text-xs font-semibold">Memuat artikel pilihan...</p>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-2xs"
        >
          <Icon path={mdiArrowLeft} size={0.7} />
          <span>Kembali ke Daftar Berita</span>
        </Link>

        <article className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-6">
          
          {/* header */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-snug">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 pt-2 pb-4 border-b border-gray-100">
              <span className="flex items-center gap-1.5 font-medium">
                <Icon
                  path={mdiCalendarBlankOutline}
                  size={0.7}
                  className="text-primary"
                />
                {formatDate(item.createdAt)}
              </span>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 font-semibold text-gray-600">
                  <Icon path={mdiEyeOutline} size={0.65} className="text-gray-400" />
                  {item.views ?? 0} Pembaca
                </span>
                <span className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 font-semibold">
                  <Icon path={mdiHeartOutline} size={0.65} />
                  {item.likes ?? 0} Suka
                </span>
              </div>
            </div>
          </div>

          {/* thumbnail */}
          {item.thumbnailUrl ? (
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 aspect-video max-h-105 w-full bg-gray-100">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 border border-gray-100 h-56 flex flex-col items-center justify-center text-gray-400">
              <Icon path={mdiImageOffOutline} size={2} className="text-gray-300 mb-1" />
              <span className="text-xs font-semibold">Tanpa Gambar Utama</span>
            </div>
          )}

          {/* konten artikel */}
          <div
            className="text-gray-700 text-base leading-relaxed space-y-5 pt-2 
              [&>p]:mb-4 [&>p]:leading-relaxed
              [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5
              [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5
              [&>h1]:text-2xl [&>h1]:font-black [&>h1]:text-gray-900 [&>h1]:mt-6 [&>h1]:mb-3
              [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-6 [&>h2]:mb-3
              [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-4 [&>h3]:mb-2
              [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-4
              [&>img]:rounded-xl [&>img]:shadow-sm [&>img]:my-6"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />

          {/* footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-8 border-t border-gray-100 gap-4">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                liked
                  ? "bg-red-50 text-red-600 border border-red-200 cursor-default"
                  : "bg-red-500 hover:bg-red-600 text-white active:scale-95 shadow-red-500/20"
              }`}
            >
              <Icon path={mdiHeartOutline} size={0.75} />
              <span>{liked ? "Artikel Telah Disukai" : "Sukai Artikel Ini"}</span>
            </button>

            {/* share sosmed */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-gray-400 mr-1">
                Bagikan:
              </span>

              {canNativeShare && (
                <button
                  onClick={() => handleShare("native")}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                  title="Bagikan"
                >
                  <Icon path={mdiShareVariantOutline} size={0.75} />
                </button>
              )}

              <button
                onClick={() => handleShare("wa")}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
                title="WhatsApp"
              >
                <Icon path={mdiWhatsapp} size={0.75} />
              </button>

              <button
                onClick={() => handleShare("fb")}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
                title="Facebook"
              >
                <Icon path={mdiFacebook} size={0.75} />
              </button>

              <button
                onClick={() => handleShare("copy")}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                title="Salin Tautan"
              >
                <Icon path={mdiLinkVariant} size={0.75} />
              </button>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}