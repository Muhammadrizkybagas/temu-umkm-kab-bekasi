"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import {
  mdiArrowLeft,
  mdiUpload,
  mdiLoading,
  mdiChevronDown,
  mdiMagnify,
  mdiCheck,
} from "@mdi/js";
import { uploadFileAction } from "@/app/actions/upload";
import {
  getProductById,
  updateProduct,
  getProductFormOptions,
} from "../../actions";

interface DropdownItem {
  id: string;
  name: string;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: productId } = use(params);

  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [umkms, setUmkms] = useState<DropdownItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    umkmId: "",
    categoryId: "",
  });

  // State & Ref untuk Custom Searchable Dropdown UMKM
  const [isUmkmOpen, setIsUmkmOpen] = useState(false);
  const [umkmSearch, setUmkmSearch] = useState("");
  const umkmDropdownRef = useRef<HTMLDivElement>(null);

  // State & Ref untuk Custom Searchable Dropdown Kategori
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [{ umkmList: umkmData, categoryList: catData }, prodData] =
          await Promise.all([
            getProductFormOptions(),
            getProductById(productId),
          ]);

        setCategories(catData);
        setUmkms(umkmData);

        if (prodData) {
          setForm({
            name: prodData.name || "",
            price: prodData.price?.toString() || "",
            description: prodData.description || "",
            imageUrl: prodData.imageUrl || "",
            umkmId: prodData.umkmId || "",
            categoryId: prodData.categoryId || "",
          });
        } else {
          Swal.fire("Error", "Data produk tidak ditemukan", "error");
          router.push("/admin/produk");
        }
      } catch (err: any) {
        console.error("Error loading edit data:", err);
        Swal.fire(
          "Error",
          err.message || "Gagal memuat data produk",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchData();
  }, [productId, router]);

  // Close dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        umkmDropdownRef.current &&
        !umkmDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUmkmOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter UMKM & Kategori berdasarkan input pencarian
  const filteredUmkms = umkms.filter((u) =>
    u.name.toLowerCase().includes(umkmSearch.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const selectedUmkm = umkms.find((u) => u.id === form.umkmId);
  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  // Handle upload gambar
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadFileAction(formData);

      if (res.error) throw new Error(res.error);
      if (res.url) {
        setForm((prev) => ({ ...prev, imageUrl: res.url }));
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      Swal.fire("Error!", err.message || "Gagal mengunggah foto", "error");
    } finally {
      setUploading(false);
    }
  };

  // Handle submit form edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.umkmId || !form.categoryId) {
      Swal.fire("Peringatan", "Pilih UMKM dan Kategori terlebih dahulu!", "warning");
      return;
    }

    try {
      setSubmitting(true);

      const result = await updateProduct(productId, {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        imageUrl: form.imageUrl,
        umkmId: form.umkmId,
        categoryId: form.categoryId,
      });

      if (!result.success) {
        throw new Error(result.error || "Gagal memperbarui produk");
      }

      await Swal.fire({
        title: "Berhasil!",
        text: "Data produk berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/admin/produk");
    } catch (err: any) {
      console.error("Submit error:", err);
      Swal.fire(
        "Gagal!",
        err.message || "Terjadi kesalahan saat memperbarui produk.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2 font-medium">
        <Icon path={mdiLoading} size={1} className="animate-spin text-primary" />
        Memuat data produk...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
        >
          <Icon path={mdiArrowLeft} size={0.9} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Produk</h1>
          <p className="text-sm font-medium text-slate-500">Perbarui informasi produk UMKM</p>
        </div>
      </div>

      {/* Main Card Form */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Foto Produk */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Foto Produk
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 shadow-xs">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 text-center px-1">
                    Belum ada foto
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-medium cursor-pointer transition-all border border-slate-200/60 shadow-xs">
                  <Icon
                    path={uploading ? mdiLoading : mdiUpload}
                    size={0.7}
                    className={uploading ? "animate-spin text-primary" : ""}
                  />
                  <span>{uploading ? "Mengunggah..." : "Ganti Foto"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] font-semibold text-slate-400">
                  Format JPG, PNG, WEBP max 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Nama Produk */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama produk"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* SEARCHABLE DROPDOWN UMKM */}
            <div className="relative" ref={umkmDropdownRef}>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Pemilik UMKM <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsUmkmOpen(!isUmkmOpen);
                  setIsCategoryOpen(false);
                }}
                className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 cursor-pointer flex items-center justify-between text-left"
              >
                <span className={selectedUmkm ? "text-slate-800" : "text-slate-400"}>
                  {selectedUmkm ? selectedUmkm.name : "-- Pilih UMKM --"}
                </span>
                <Icon
                  path={mdiChevronDown}
                  size={0.8}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isUmkmOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUmkmOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Icon path={mdiMagnify} size={0.7} className="text-slate-400 ml-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Cari nama UMKM..."
                      value={umkmSearch}
                      onChange={(e) => setUmkmSearch(e.target.value)}
                      autoFocus
                      className="w-full py-1.5 pr-3 text-xs bg-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                    {filteredUmkms.length > 0 ? (
                      filteredUmkms.map((u) => {
                        const isSelected = u.id === form.umkmId;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              setForm((p) => ({ ...p, umkmId: u.id }));
                              setIsUmkmOpen(false);
                              setUmkmSearch("");
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary/10 text-primary"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{u.name}</span>
                            {isSelected && <Icon path={mdiCheck} size={0.6} className="text-primary" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400 font-medium">
                        UMKM tidak ditemukan
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SEARCHABLE DROPDOWN KATEGORI PRODUK */}
            <div className="relative" ref={categoryDropdownRef}>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori Produk <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsUmkmOpen(false);
                }}
                className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 cursor-pointer flex items-center justify-between text-left"
              >
                <span className={selectedCategory ? "text-slate-800" : "text-slate-400"}>
                  {selectedCategory ? selectedCategory.name : "-- Pilih Kategori --"}
                </span>
                <Icon
                  path={mdiChevronDown}
                  size={0.8}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Icon path={mdiMagnify} size={0.7} className="text-slate-400 ml-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Cari kategori..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      autoFocus
                      className="w-full py-1.5 pr-3 text-xs bg-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((c) => {
                        const isSelected = c.id === form.categoryId;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setForm((p) => ({ ...p, categoryId: c.id }));
                              setIsCategoryOpen(false);
                              setCategorySearch("");
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary/10 text-primary"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{c.name}</span>
                            {isSelected && <Icon path={mdiCheck} size={0.6} className="text-primary" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400 font-medium">
                        Kategori tidak ditemukan
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Harga */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              placeholder="0"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi Produk
            </label>
            <textarea
              rows={4}
              placeholder="Tuliskan deskripsi ringkas mengenai produk..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
            ></textarea>
          </div>

          {/* button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-full font-medium text-[13px] bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-3 rounded-full font-medium text-[13px] bg-primary hover:bg-[#2d7e79] text-white shadow-md shadow-primary/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {submitting && <Icon path={mdiLoading} size={0.7} className="animate-spin" />}
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}