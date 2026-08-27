"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { deleteNews } from "./actions"; 
import Icon from "@mdi/react";
import {
  mdiPlus,
  mdiMagnify,
  mdiPencilOutline,
  mdiDeleteOutline,
  mdiImageOffOutline,
  mdiEyeOutline,
  mdiHeartOutline,
  mdiNewspaper,
  mdiAccountOutline,
} from "@mdi/js";
import Pagination from "@/components/Pagination";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  editor?: string | null;
  thumbnailUrl?: string;
  status: string;
  views: number;
  likes: number;
  createdAt: string | number;
}

const ITEMS_PER_PAGE = 10;

export default function AdminBeritaPage() {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/news");
      if (!res.ok) throw new Error("Gagal memuat data berita");
      const resData = await res.json();
      setData(resData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  
  const handleDelete = (id: string, title: string) => {
    Swal.fire({
      title: "Hapus Berita?",
      text: `Berita "${title}" akan dihapus secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        
        const res = await deleteNews(id, title);
        
        if (!res.success) {
          throw new Error(res.error || "Gagal menghapus berita");
        }

        setData((prev) => {
          const newData = prev.filter((item) => item.id !== id);
          const newTotalPages = Math.ceil(newData.length / ITEMS_PER_PAGE);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }
          return newData;
        });

        Swal.fire({ 
          title: "Terhapus!", 
          text: "Berita berhasil dihapus.", 
          icon: "success", 
          timer: 1500, 
          showConfirmButton: false 
        });
      } catch (err: any) {
        Swal.fire("Gagal!", err.message || "Terjadi kesalahan saat menghapus.", "error");
      }
    });
  };

  const formatDate = (dateValue: string | number) => {
    if (!dateValue) return "-";
    const date = new Date(typeof dateValue === "number" ? dateValue * 1000 : dateValue);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "published":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Published</span>;
      case "draft":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">Draft</span>;
      case "tidak aktif":
      case "inactive":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Tidak Aktif</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">{status || "Draft"}</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Manajemen Berita</h1>
          <p className="text-sm text-gray-500">Kelola publikasi berita & artikel UMKM Kabupaten Bekasi</p>
        </div>
        <Link 
          href="/admin/berita/tambah" 
          className="bg-primary hover:bg-[#2489b5] text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm text-center sm:w-auto w-full"
        >
          <Icon path={mdiPlus} size={0.8} /> Tambah Berita
        </Link>
      </div>

      <div className="bg-secondary rounded-xl shadow-soft border border-gray-100 overflow-hidden p-4">
        <div className="mb-4 flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul berita..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data berita...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
            <Icon path={mdiNewspaper} size={1.5} className="text-gray-300" />
            <span>Belum ada data berita. Silakan buat berita pertama Anda.</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Berita dengan kata kunci <span className="font-semibold">"{searchTerm}"</span> tidak ditemukan.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface border-b border-gray-100 text-gray-600">
                    <th className="p-4 font-semibold w-12 text-center">No.</th>
                    <th className="p-4 font-semibold">Judul Berita</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Tanggal</th>
                    <th className="p-4 font-semibold text-center">Statistik</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => {
                    const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                    return (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-surface/50">
                        <td className="p-4 text-center font-medium text-gray-500">{rowNumber}</td>
                        <td className="p-4 font-medium text-textMain max-w-xs md:max-w-md">
                          <div className="flex items-center gap-3">
                            {item.thumbnailUrl ? (
                              <img src={item.thumbnailUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-100 shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                <Icon path={mdiImageOffOutline} size={0.7} />
                              </div>
                            )}
                            <div className="truncate">
                              <span className="block font-semibold text-textMain line-clamp-1">{item.title}</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Icon path={mdiAccountOutline} size={0.55} />
                                {item.editor || "Tanpa Penulis"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <div className="flex justify-center items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                              <Icon path={mdiEyeOutline} size={0.6} /> {item.views || 0}
                            </span>
                            <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md">
                              <Icon path={mdiHeartOutline} size={0.6} /> {item.likes || 0}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <div className="flex gap-2 justify-center items-center">
                            <Link href={`/admin/berita/edit/${item.id}`} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-md transition-colors flex items-center gap-1">
                              <Icon path={mdiPencilOutline} size={0.65} /> Edit
                            </Link>
                            <button onClick={() => handleDelete(item.id, item.title)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-md transition-colors flex items-center gap-1">
                              <Icon path={mdiDeleteOutline} size={0.65} /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
}