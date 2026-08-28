"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import { 
  mdiArrowLeft, 
  mdiContentSave, 
  mdiCloudUpload, 
  mdiClose, 
  mdiChevronDown,
  mdiMagnify,
  mdiCheck
} from "@mdi/js";
import { createUmkm } from "../actions";

export default function TambahUMKMPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  
  const [districtOpen, setDistrictOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const districtRef = useRef<HTMLDivElement>(null);

  const KAB_BEKASI_DISTRICTS = [
    "Babelan", "Bojongmangu", "Cabangbungin", "Cibarusah", "Cibitung",
    "Cikarang Barat", "Cikarang Pusat", "Cikarang Selatan", "Cikarang Timur", "Cikarang Utara",
    "Karangbahagia", "Kedungwaringin", "Muaragembong", "Pebayuran", "Serang Baru",
    "Setu", "Sukakarya", "Sukatani", "Sukawangi", "Tambelang",
    "Tambun Selatan", "Tambun Utara", "Tarumajaya"
  ].sort();

  
  const filteredDistricts = KAB_BEKASI_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setDistrictOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form 
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
      const res = await createUmkm(form);

      if (res.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data UMKM berhasil ditambahkan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/admin/umkm");
      } else {
        Swal.fire("Gagal Simpan!", res.error || "Gagal menambah UMKM baru.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Terjadi kesalahan server.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/umkm"
            className="p-2.5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 shadow-2xs flex items-center justify-center"
          >
            <Icon path={mdiArrowLeft} size={0.85} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Tambah UMKM Baru</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Isi formulir data UMKM Kabupaten Bekasi</p>
          </div>
        </div>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-5">
        
        {/* nama umkm dan pemilik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Nama UMKM <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Dapoer Ditra"
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Nama Pemilik <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="ownerName"
              required
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Contoh: Ditra Pratama"
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-2xs"
            />
          </div>
        </div>


        {/* no hp dan kecamatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              No. HP / Whatsapp <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="08123456789"
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-2xs"
            />
          </div>

          {/* Searchable Select Kecamatan */}
          <div className="relative" ref={districtRef}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Kecamatan <span className="text-rose-500">*</span>
            </label>


            <button
              type="button"
              onClick={() => setDistrictOpen(!districtOpen)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-sm font-medium text-left text-slate-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-2xs flex items-center justify-between cursor-pointer"
            >
              <span className={form.district ? "text-slate-800 font-semibold" : "text-slate-400 font-normal"}>
                {form.district || "Pilih Kecamatan..."}
              </span>
              <Icon path={mdiChevronDown} size={0.75} className={`text-slate-400 transition-transform duration-200 ${districtOpen ? "rotate-180" : ""}`} />
            </button>


            {districtOpen && (
              <div className="absolute z-30 left-0 right-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Input Pencarian */}
                <div className="relative">
                  <Icon path={mdiMagnify} size={0.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    autoFocus
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder="Cari kecamatan..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                {/* List Hasil Pencarian */}
                <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map((kecamatan) => {
                      const isSelected = form.district === kecamatan;
                      return (
                        <button
                          key={kecamatan}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, district: kecamatan }));
                            setDistrictOpen(false);
                            setDistrictSearch("");
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 text-primary font-bold"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span>{kecamatan}</span>
                          {isSelected && <Icon path={mdiCheck} size={0.65} className="text-primary" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-4 text-center text-xs text-slate-400 font-medium">
                      Kecamatan tidak ditemukan
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Desa */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Desa / Kelurahan <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="village"
            required
            value={form.village}
            onChange={handleChange}
            placeholder="Contoh: Sukamahi"
            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-2xs"
          />
        </div>



        {/* Alamat Lengkap */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Alamat Lengkap <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="address"
            required
            rows={2}
            value={form.address}
            onChange={handleChange}
            placeholder="Jl. Raya Komplek Pemda No. 12"
            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-2xs"
          ></textarea>
        </div>



        {/* deskripsi */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Deskripsi Ringkas
          </label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Keterangan mengenai usaha ini..."
            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-2xs"
          ></textarea>
        </div>



        {/* upload logo */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Logo / Foto UMKM
          </label>

          {form.logoUrl ? (
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 group">
              <img src={form.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, logoUrl: "" }))}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all"
                title="Hapus Logo"
              >
                <Icon path={mdiClose} size={0.6} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200/80 hover:border-primary/50 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Icon path={mdiCloudUpload} size={1.2} className="text-slate-400 mb-2" />
                <p className="text-xs font-medium text-slate-600">
                  {uploadingLogo ? "Mengunggah gambar..." : "Klik untuk unggah logo UMKM"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, atau WEBP</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="hidden"
              />
            </label>
          )}
        </div>



        {/* status mitra */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Status Kemitraan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              name="status"
              value={form.status || "Bermitra"}
              onChange={handleChange}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all appearance-none shadow-2xs cursor-pointer"
            >
              <option value="Bermitra">Bermitra</option>
              <option value="Inkubator">Inkubator</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
              <Icon path={mdiChevronDown} size={0.75} />
            </div>
          </div>
        </div>



        {/* checkbox naik kelas */}
        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl hover:bg-slate-50 transition-all w-fit">
            <input
              type="checkbox"
              checked={form.isNaikKelas}
              onChange={(e) => setForm((prev) => ({ ...prev, isNaikKelas: e.target.checked }))}
              className="w-4 h-4 text-primary rounded-md border-slate-300 focus:ring-primary/20 cursor-pointer"
            />
            <span className="text-sm font-semibold text-slate-700">Tandai sebagai UMKM Naik Kelas</span>
          </label>
        </div>



        {/* button */}
        <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            href="/admin/umkm"
            className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full font-reguler text-sm transition-all"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingLogo}
            className="flex items-center gap-2 bg-primary hover:bg-[#2489b5] text-white px-6 py-2.5 rounded-full font-reguler text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Icon path={mdiContentSave} size={0.8} />
            {submitting ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </form>
    </div>
  );
}