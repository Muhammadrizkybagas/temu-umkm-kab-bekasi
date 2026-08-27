"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiCalendarBlankOutline,
  mdiEyeOutline,
  mdiHeartOutline,
  mdiImageOffOutline,
  mdiFire,
  mdiThumbUpOutline,
  mdiNewspaperVariantOutline,
  mdiChevronLeft,
  mdiChevronRight,
} from "@mdi/js";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  thumbnailUrl: string | null;
  createdAt: Date | string | null;
  views: number | null;
  likes: number | null;
}

interface NewsClientListProps {
  berita: NewsItem[];
}

function stripHtml(htmlString: string) {
  if (!htmlString) return "";
  return htmlString.replace(/<[^>]*>?/gm, "").trim();
}

function formatDate(dateValue: string | number | Date | null) {
  if (!dateValue) return "-";
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsClientList({ berita }: NewsClientListProps) {
  const [activeTab, setActiveTab] = useState<"terbaru" | "populer" | "disukai">("terbaru");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  
  const sortedBerita = [...berita].sort((a, b) => {
    if (activeTab === "populer") {
      return (b.views ?? 0) - (a.views ?? 0);
    } else if (activeTab === "disukai") {
      return (b.likes ?? 0) - (a.likes ?? 0);
    } else {
        
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
  });

  
  const totalPages = Math.ceil(sortedBerita.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedBerita.slice(startIndex, startIndex + itemsPerPage);

  
  const handleTabChange = (tab: "terbaru" | "populer" | "disukai") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (berita.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-soft max-w-xl mx-auto space-y-3">
        <div className="text-gray-300 flex justify-center">
          <Icon path={mdiNewspaperVariantOutline} size={3} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Belum Ada Berita</h3>
        <p className="text-sm text-gray-500">
          Saat ini belum ada artikel atau berita yang diterbitkan oleh administrator.
        </p>
      </div>
    );
  }

  
  const featuredNews = activeTab === "terbaru" && currentPage === 1 ? currentItems[0] : null;
  const regularNewsList = featuredNews ? currentItems.slice(1) : currentItems;

  return (
    <div className="space-y-8">
        
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-200/60 pb-6">
        <button
          onClick={() => handleTabChange("terbaru")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "terbaru"
              ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Icon path={mdiNewspaperVariantOutline} size={0.75} />
          <span>Semua Berita</span>
        </button>

        <button
          onClick={() => handleTabChange("populer")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "populer"
              ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Icon path={mdiFire} size={0.75} />
          <span>Views Terbanyak (Populer)</span>
        </button>

        <button
          onClick={() => handleTabChange("disukai")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "disukai"
              ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Icon path={mdiThumbUpOutline} size={0.75} />
          <span>Likes Terbanyak</span>
        </button>
      </div>


      {featuredNews && (
        <Link
          href={`/berita/${featuredNews.slug}`}
          className="group relative bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
        >
        <div className="lg:col-span-5 bg-gray-100 relative overflow-hidden rounded-xl shadow-md h-64 lg:h-72">
        {featuredNews.thumbnailUrl ? (
            <img
            src={featuredNews.thumbnailUrl}
            alt={featuredNews.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Icon path={mdiImageOffOutline} size={2} />
            </div>
        )}
        
        
        <div className="absolute top-3 left-3 bg-white text-primary text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <Icon path={mdiFire} size={0.65} />
            Berita Terkini
        </div>
        </div>

          <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <Icon path={mdiCalendarBlankOutline} size={0.75} />
                  {formatDate(featuredNews.createdAt)}
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 group-hover:text-primary transition-colors leading-tight line-clamp-3">
                {featuredNews.title}
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                {stripHtml(featuredNews.content || "")}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Icon path={mdiEyeOutline} size={0.75} className="text-gray-400" />
                {featuredNews.views ?? 0} Pembaca
              </span>
              <span className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg">
                <Icon path={mdiHeartOutline} size={0.75} />
                {featuredNews.likes ?? 0} Suka
              </span>
            </div>
          </div>
        </Link>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regularNewsList.map((item) => {
          const textContent = stripHtml(item.content || "");

          return (
            <Link
              href={`/berita/${item.slug}`}
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-2xs border border-gray-100/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Icon path={mdiImageOffOutline} size={1.5} />
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col grow justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <Icon path={mdiCalendarBlankOutline} size={0.7} />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {textContent && (
                    <p className="text-xs lg:text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {textContent}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
                    <Icon path={mdiEyeOutline} size={0.7} />
                    {item.views ?? 0} Pembaca
                  </span>
                  <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-md">
                    <Icon path={mdiHeartOutline} size={0.7} />
                    {item.likes ?? 0} Suka
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>


      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all shadow-2xs"
          >
            <Icon path={mdiChevronLeft} size={1} />
          </button>

          <div className="flex items-center gap-1 px-4">
            <span className="text-xs font-bold text-gray-700">Halaman {currentPage}</span>
            <span className="text-xs text-gray-400">dari {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all shadow-2xs"
          >
            <Icon path={mdiChevronRight} size={1} />
          </button>
        </div>
      )}
    </div>
  );
}