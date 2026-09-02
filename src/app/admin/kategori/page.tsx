"use client";

import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import { mdiTrashCan, mdiPlus, mdiPencil, mdiMagnify, mdiFolderOutline } from "@mdi/js";
import Pagination from "@/components/Pagination";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./actions";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ITEMS_PER_PAGE = 8;

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCategoriesData = async () => {
    try {
      const data = await getCategories();
      setCategories(data as Category[]);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    try {
      const res = await createCategory(name, slug);

      if (res.success) {
        setName("");
        fetchCategoriesData();
        Swal.fire({
          title: "Berhasil!",
          text: "Kategori baru berhasil ditambahkan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Gagal!", res.error || "Gagal menambah kategori.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Terjadi kesalahan server.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Kategori
  const handleEdit = async (id: string, currentName: string) => {
    const { value: newName } = await Swal.fire({
      title: "Edit Kategori",
      input: "text",
      inputLabel: "Nama Kategori Baru",
      inputValue: currentName,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#34908B",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Nama kategori tidak boleh kosong!";
        }
      },
    });

    if (!newName) return;

    const slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    try {
      const res = await updateCategory(id, newName, slug);

      if (res.success) {
        fetchCategoriesData();
        Swal.fire({
          title: "Berhasil!",
          text: "Kategori berhasil diperbarui.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Gagal!", res.error || "Gagal memperbarui kategori.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Terjadi kesalahan server.", "error");
    }
  };

  // Hapus Kategori
  const handleDelete = (id: string, categoryName: string) => {
    Swal.fire({
      title: "Hapus Kategori?",
      text: `Kategori "${categoryName}" akan dihapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await deleteCategory(id, categoryName);

        if (res.success) {
          fetchCategoriesData();
          Swal.fire({
            title: "Terhapus!",
            text: "Kategori berhasil dihapus.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire("Gagal!", res.error || "Gagal menghapus kategori.", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Terjadi kesalahan server.", "error");
      }
    });
  };

return (
    <div className="max-w-6xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Kategori</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Kelola kategori produk UMKM Kabupaten Bekasi dengan mudah</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">Total Kategori: {categories.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/*add kategori */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit sticky top-6 group/card hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Icon path={mdiPlus} size={0.9} />
            </div>
            <h2 className="font-bold text-slate-900 text-sm">Tambah Kategori Baru</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nama Kategori</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kuliner, Fashion, Kriya"
                className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-normal text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-teal-medium text-white py-3 rounded-full text-[14px] font-normal shadow-md shadow-primary/20 transition-all disabled:opacity-70 cursor-pointer"
            >
              <Icon path={mdiPlus} size={0.8} />
              {submitting ? "Menyimpan..." : "Simpan Kategori"}
            </button>
          </form>
        </div>

        {/* tabel kategori */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Icon path={mdiMagnify} size={0.8} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); 
                  }}
                  placeholder="Cari kategori..."
                  className="w-full pl-10 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-full focus:ring-2 focus:ring-primary outline-none font-normal text-slate-700 placeholder:text-slate-400 transition-all"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-primary hover:underline whitespace-nowrap cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">Memuat data kategori...</div>
            ) : filteredCategories.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-1">
                  <Icon path={mdiFolderOutline} size={1.2} />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  {categories.length === 0 ? "Belum ada kategori tersedia." : "Kategori tidak ditemukan."}
                </p>
              </div>
            ) : (
              <div className="p-4">
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <table className="w-full text-left text-xs whitespace-nowrap md:whitespace-normal border-collapse">
                    <thead>
                      <tr className="bg-primary text-white font-medium text-[14px] ">
                        <th className="p-3.5 w-12 text-center font-normal">No.</th>
                        <th className="p-3.5 font-normal">Nama Kategori</th>
                        <th className="p-3.5 font-normal">Slug URL</th>
                        <th className="p-3.5 text-center font-normal">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCategories.map((cat, index) => {
                        const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                        const isEven = index % 2 === 1;

                        return (
                          <tr 
                            key={cat.id} 
                            className={`border-b border-slate-100 transition-colors ${
                              isEven ? "bg-teal-light/15 hover:bg-teal-light/30" : "bg-white hover:bg-slate-50"
                            }`}
                          >
                            <td className="p-3.5 text-center font-normal text-[12px] text-slate-500">{rowNumber}</td>
                            <td className="p-3.5 font-semibold text-[12px] text-slate-800">{cat.name}</td>
                            <td className="p-3.5 text-slate-600 font-normal">
                              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs font-mono text-[12px] text-slate-600 inline-block">
                                {cat.slug}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex gap-2 justify-center items-center">
                                <button
                                  onClick={() => handleEdit(cat.id, cat.name)}
                                  className="px-3 py-1.5 bg-primary hover:bg-teal-700 text-white text-xs font-normal rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Edit Kategori"
                                >
                                  <Icon path={mdiPencil} size={0.7} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(cat.id, cat.name)}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-700 text-white text-xs font-normal rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Hapus Kategori"
                                >
                                  <Icon path={mdiTrashCan} size={0.7} />
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
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredCategories.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCategories.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}