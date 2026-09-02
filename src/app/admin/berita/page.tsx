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
  mdiClose
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
    <div className="max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Berita</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Kelola publikasi berita & artikel UMKM Kabupaten Bekasi</p>
        </div>
        <Link 
          href="/admin/berita/tambah" 
          className="bg-primary hover:bg-teal-medium text-white px-5 py-2.5 rounded-full font-normal text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 text-center sm:w-auto w-full cursor-pointer"
        >
          <Icon path={mdiPlus} size={0.8} /> Tambah Berita
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80 md:w-96 group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-200 pointer-events-none flex items-center">
                <Icon path={mdiMagnify} size={0.85} />
              </div>

              <input
                type="text"
                placeholder="Cari judul atau isi berita..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-normal text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary transition-all"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange({ target: { value: "" } } as any)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                  title="Bersihkan pencarian"
                >
                  <Icon path={mdiClose} size={0.55} />
                </button>
              )}
            </div>
            {searchTerm && (
              <button
                onClick={() => handleSearchChange({ target: { value: "" } } as any)}
                className="text-xs font-bold text-primary hover:underline whitespace-nowrap cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">Memuat data berita...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-500 text-xs font-bold">{error}</div>
          ) : data.length === 0 ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-1">
                <Icon path={mdiNewspaper} size={1.2} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Belum ada data berita. Silakan buat berita pertama Anda.</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              Berita dengan kata kunci <span className="font-semibold text-slate-600">"{searchTerm}"</span> tidak ditemukan.
            </div>
          ) : (
            <div className="p-4">
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left text-xs whitespace-nowrap md:whitespace-normal border-collapse">
                  <thead>
                    <tr className="bg-primary text-white font-semibold text-[14px]">
                      <th className="p-3.5 w-12 text-center font-normal">No.</th>
                      <th className="p-3.5 font-normal">Judul Berita</th>
                      <th className="p-3.5 font-normal">Status</th>
                      <th className="p-3.5 font-normal">Tanggal</th>
                      <th className="p-3.5 text-center font-normal">Statistik</th>
                      <th className="p-3.5 text-center font-normal">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, index) => {
                      const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                      const isEven = index % 2 === 1;

                      return (
                        <tr 
                          key={item.id} 
                          className={`border-b border-slate-100 transition-colors ${
                            isEven ? "bg-teal-light/15 hover:bg-teal-light/30" : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          <td className="p-3.5 text-center font-normal text-slate-500">{rowNumber}</td>
                          <td className="p-3.5 font-normal text-slate-800 max-w-xs md:max-w-md">
                            <div className="flex items-center gap-3">
                              {item.thumbnailUrl ? (
                                <img src={item.thumbnailUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                  <Icon path={mdiImageOffOutline} size={0.7} />
                                </div>
                              )}
                              <div className="truncate">
                                <span className="block font-semibold text-slate-800 line-clamp-1">{item.title}</span>
                                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Icon path={mdiAccountOutline} size={0.55} />
                                  {item.editor || "Tanpa Penulis"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 whitespace-nowrap font-normal">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="p-3.5 text-slate-600 whitespace-nowrap font-normal">{formatDate(item.createdAt)}</td>
                          <td className="p-3.5 text-center whitespace-nowrap font-normal">
                            <div className="flex justify-center items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                                <Icon path={mdiEyeOutline} size={0.6} /> {item.views || 0}
                              </span>
                              <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md">
                                <Icon path={mdiHeartOutline} size={0.6} /> {item.likes || 0}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <div className="flex gap-2 justify-center items-center">
                              <Link 
                                href={`/admin/berita/edit/${item.id}`} 
                                className="px-3 py-1.5 bg-primary hover:bg-teal-700 text-white text-xs font-normal rounded-full transition-colors flex items-center gap-1"
                              >
                                <Icon path={mdiPencilOutline} size={0.65} /> Edit
                              </Link>
                              <button 
                                onClick={() => handleDelete(item.id, item.title)} 
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-normal rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                              >
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
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/30">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}