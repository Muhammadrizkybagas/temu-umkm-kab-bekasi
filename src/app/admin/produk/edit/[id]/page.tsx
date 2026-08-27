"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiUpload, mdiLoading } from "@mdi/js";
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
  const [umkmList, setUmkmList] = useState<DropdownItem[]>([]);

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

  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [{ umkmList: umkms, categoryList: cats }, prodData] =
          await Promise.all([
            getProductFormOptions(),
            getProductById(productId),
          ]);

        setCategories(cats);
        setUmkmList(umkms);

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
      Swal.fire("Gagal!", err.message || "Terjadi kesalahan saat memperbarui produk.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
        <Icon path={mdiLoading} size={1} className="animate-spin" />
        Memuat data produk...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/produk"
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
        >
          <Icon path={mdiArrowLeft} size={0.8} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-textMain">Edit Produk</h1>
          <p className="text-sm text-gray-500">Perbarui informasi produk UMKM</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Foto Produk
          </label>
          <div className="flex items-center gap-4">
            {form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-20 h-20 rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">
                No Pic
              </div>
            )}
            <div>
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all inline-flex items-center gap-2">
                <Icon
                  path={uploading ? mdiLoading : mdiUpload}
                  size={0.7}
                  className={uploading ? "animate-spin" : ""}
                />
                {uploading ? "Mengunggah..." : "Ganti Foto"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-[11px] text-gray-400 mt-1">Format JPG, PNG, WEBP max 2MB</p>
            </div>
          </div>
        </div>

        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nama Produk *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pemilik UMKM *
            </label>
            <select
              required
              value={form.umkmId}
              onChange={(e) => setForm((p) => ({ ...p, umkmId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            >
              <option value="">-- Pilih UMKM --</option>
              {umkmList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kategori Produk *
            </label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Harga */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Harga (Rp) *
          </label>
          <input
            type="number"
            required
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Deskripsi Produk
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/admin/produk"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-all"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="px-5 py-2 bg-primary hover:bg-[#2489b5] text-white text-sm font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {submitting && <Icon path={mdiLoading} size={0.7} className="animate-spin" />}
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}