"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import {
  mdiPlus,
  mdiFileDocumentOutline,
  mdiFileExcel,
  mdiMagnify,
  mdiPencilOutline,
  mdiDeleteOutline,
  mdiImageOffOutline,
  mdiClose
} from "@mdi/js";
import Pagination from "@/components/Pagination";
import { getProducts, deleteProduct } from "./actions";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  umkmName: string | null;
  categoryName: string | null;
}

const ITEMS_PER_PAGE = 10;

export default function AdminProdukPage() {
  const [data, setData] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resData = await getProducts();
      setData(resData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.umkmName && item.umkmName.toLowerCase().includes(searchTerm.toLowerCase()))
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

  // delete produk
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Ingin menghapus produk "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteProduct(id);

      if (!res.success) {
        throw new Error(res.error || "Gagal menghapus produk");
      }

      Swal.fire({
        title: "Terhapus!",
        text: `Produk "${name}" berhasil dihapus.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setData((prev) => {
        const newData = prev.filter((item) => item.id !== id);
        const newTotalPages = Math.ceil(newData.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return newData;
      });
    } catch (err: any) {
      Swal.fire("Error!", err.message || "Terjadi kesalahan saat menghapus produk.", "error");
    }
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return Swal.fire("Peringatan", "Tidak ada data untuk di-export.", "info");

    const headers = ["Nama Produk", "UMKM", "Kategori", "Harga (Rp)"];
    const rows = filteredData.map((item) => [
      `"${item.name.replace(/"/g, '""')}"`,
      `"${(item.umkmName || "-").replace(/"/g, '""')}"`,
      `"${(item.categoryName || "-").replace(/"/g, '""')}"`,
      item.price,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `katalog_produk_umkm_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) return Swal.fire("Peringatan", "Tidak ada data untuk di-export.", "info");

    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <thead>
            <tr style="background-color: #34908B; color: white; font-weight: bold;">
              <th>Nama Produk</th>
              <th>UMKM</th>
              <th>Kategori</th>
              <th>Harga (Rp)</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.umkmName || "-"}</td>
                <td>${item.categoryName || "-"}</td>
                <td>${item.price}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `katalog_produk_umkm_${new Date().toISOString().split("T")[0]}.xls`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Manajemen Produk</h1>
          <p className="text-sm text-gray-500">Kelola produk UMKM Kabupaten Bekasi</p>
        </div>
        <Link
          href="/admin/produk/tambah"
          className="bg-primary hover:bg-teal-medium text-white px-5 py-2.5 rounded-full font-normal text-sm transition-all flex items-center justify-center gap-2 shadow-sm text-center sm:w-auto w-full"
        >
          <Icon path={mdiPlus} size={0.8} />
          Tambah Produk
        </Link>
      </div>

      {/* card tabel */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden p-4 border border-slate-100">
        <div className="mb-4 flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80 md:w-96 group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-200 pointer-events-none flex items-center">
              <Icon path={mdiMagnify} size={0.85} />
            </div>

            <input
              type="text"
              placeholder="Cari produk atau UMKM..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200/80 rounded-full text-xs sm:text-sm font-normal text-slate-800 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-xs"
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

          {/* button export */}
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={exportToCSV}
              className="flex-1 md:flex-none px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-normal rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Icon path={mdiFileDocumentOutline} size={0.7} />
              Export CSV
            </button>
            <button
              onClick={exportToExcel}
              className="flex-1 md:flex-none px-3.5 py-2 bg-primary hover:bg-teal-medium text-white text-xs font-normal rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Icon path={mdiFileExcel} size={0.7} />
              Export Excel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 font-normal">Memuat data produk...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-normal">{error}</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-normal">Belum ada data produk.</div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-normal">
            Produk dengan kata kunci <span className="font-medium">"{searchTerm}"</span> tidak ditemukan.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-white font-normal">
                    <th className="p-3.5 font-normal w-12 text-center">No.</th>
                    <th className="p-3.5 font-normal">Produk</th>
                    <th className="p-3.5 font-normal">UMKM</th>
                    <th className="p-3.5 font-normal">Kategori</th>
                    <th className="p-3.5 font-normal">Harga</th>
                    <th className="p-3.5 font-normal text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => {
                    const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    // zebra striping
                    const isEven = index % 2 === 1;

                    return (
                      <tr 
                        key={item.id} 
                        className={`border-b border-slate-100 transition-colors ${
                          isEven ? "bg-teal-light/15 hover:bg-teal-light/30" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <td className="p-3.5 text-center font-normal text-slate-500">{rowNumber}</td>

                        {/* thumbnail */}
                        <td className="p-3.5 font-normal text-slate-800">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 border border-slate-200 flex items-center justify-center text-gray-400 shrink-0">
                                <Icon path={mdiImageOffOutline} size={0.7} />
                              </div>
                            )}
                            <span className="font-normal">{item.name}</span>
                          </div>
                        </td>

                        <td className="p-3.5 text-slate-600 font-normal">{item.umkmName || "-"}</td>
                        <td className="p-3.5 text-slate-600 font-normal">{item.categoryName || "-"}</td>
                        <td className="p-3.5 font-medium text-primary">
                          Rp {item.price.toLocaleString("id-ID")}
                        </td>

                        {/* button */}
                        <td className="p-3.5 text-center">
                          <div className="flex gap-2 justify-center items-center">
                            <Link
                              href={`/admin/produk/edit/${item.id}`}
                              className="px-3 py-1.5 bg-primary hover:bg-teal-700 text-white text-xs font-normal rounded-full transition-colors flex items-center gap-1"
                            >
                              <Icon path={mdiPencilOutline} size={0.65} />
                              Ubah
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-700 text-white text-xs font-normal rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Icon path={mdiDeleteOutline} size={0.65} />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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