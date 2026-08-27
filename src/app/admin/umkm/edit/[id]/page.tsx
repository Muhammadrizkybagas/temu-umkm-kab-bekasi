"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiContentSave } from "@mdi/js";
import { getUmkmById, updateUmkm } from "../../actions";

export default function EditUMKMPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const KAB_BEKASI_DISTRICTS = [
    "Babelan", "Bojongmangu", "Cabangbungin", "Cibarusah", "Cibitung",
    "Cikarang Barat", "Cikarang Pusat", "Cikarang Selatan", "Cikarang Timur", "Cikarang Utara",
    "Karangbahagia", "Kedungwaringin", "Muaragembong", "Pebayuran", "Serang Baru",
    "Setu", "Sukakarya", "Sukatani", "Sukawangi", "Tambelang",
    "Tambun Selatan", "Tambun Utara", "Tarumajaya"
  ].sort();

  
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    phone: "",
    district: "",
    village: "",
    address: "",
    description: "",
    logoUrl: "",
    coverUrl: "",
    status: "Bermitra", 
    isNaikKelas: false,
    isFeatured: false,
  });

  useEffect(() => {
    getUmkmById(id)
      .then((data) => {
        if (!data) {
          throw new Error("Data tidak ditemukan");
        }
        setForm({
          name: data.name || "",
          ownerName: data.ownerName || "",
          phone: data.phone || "",
          district: data.district || "",
          village: data.village || "",
          address: data.address || "",
          description: data.description || "",
          logoUrl: data.logoUrl || "",
          coverUrl: data.coverUrl || "",
          status: data.status || "Bermitra",
          isNaikKelas: Boolean(data.isNaikKelas),
          isFeatured: Boolean(data.isFeatured),
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error!", "Data UMKM tidak ditemukan", "error");
        router.push("/admin/umkm");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, logoUrl: data.url }));
      } else {
        Swal.fire("Gagal Upload!", data.error || "Gagal mengunggah foto logo", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Terjadi kesalahan upload logo", "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await updateUmkm(id, form);

      if (res.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data UMKM berhasil diperbarui.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/admin/umkm");
      } else {
        Swal.fire("Gagal Simpan!", res.error || "Gagal memperbarui UMKM.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Terjadi kesalahan server.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Memuat data UMKM...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/umkm"
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600"
          >
            <Icon path={mdiArrowLeft} size={0.9} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-textMain">Edit UMKM</h1>
            <p className="text-sm text-gray-500">Perbarui informasi data pelaku usaha</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft space-y-4">
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nama UMKM *</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Tekering"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nama Pemilik *</label>
            <input
              type="text"
              name="ownerName"
              required
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Contoh: Bagas"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* No HP & Kecamatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. HP / Whatsapp *</label>
            <input
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="08123456789 (Min. 9 digit)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Kecamatan *</label>
            <select
              name="district"
              required
              value={form.district}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer"
            >
              <option value="" disabled>Pilih Kecamatan...</option>
              {KAB_BEKASI_DISTRICTS.map((kecamatan) => (
                <option key={kecamatan} value={kecamatan}>
                  {kecamatan}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Desa / Kelurahan *</label>
            <input
              type="text"
              name="village"
              required
              value={form.village}
              onChange={handleChange}
              placeholder="Contoh: Sukamahi"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Status Kemitraan *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer"
            >
              <option value="Bermitra">Bermitra</option>
              <option value="Inkubator">Inkubator</option>
            </select>
          </div>
        </div>

        {/* Alamat Lengkap */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Alamat Lengkap *</label>
          <textarea
            name="address"
            required
            rows={2}
            value={form.address}
            onChange={handleChange}
            placeholder="Jl. Raya Komplek Pemda No. 12"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          ></textarea>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Deskripsi Ringkas</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Keterangan mengenai usaha ini..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          ></textarea>
        </div>

        {/* Upload Logo */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Logo / Foto UMKM</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {uploadingLogo && <span className="text-xs text-gray-400">Mengunggah...</span>}
          </div>
          {form.logoUrl && (
            <p className="text-xs text-emerald-600 mt-1">Logo terpasang: {form.logoUrl}</p>
          )}
        </div>

        {/* Checkbox Naik Kelas */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNaikKelas}
              onChange={(e) => setForm((prev) => ({ ...prev, isNaikKelas: e.target.checked }))}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">Tandai sebagai UMKM Naik Kelas</span>
          </label>
        </div>

        {/* Tombol aksi */}
        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Link
            href="/admin/umkm"
            className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-medium text-sm transition-all"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingLogo}
            className="flex items-center gap-2 bg-primary hover:bg-[#2489b5] text-white px-5 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
          >
            <Icon path={mdiContentSave} size={0.8} />
            {submitting ? "Perbarui..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}