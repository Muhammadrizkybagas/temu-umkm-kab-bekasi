"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import { 
  mdiDomain, 
  mdiTrendingUp, 
  mdiHandshake,
  mdiClose,
  mdiMagnify
} from "@mdi/js";
import Pagination from "@/components/Pagination";
import { getUmkms, toggleNaikKelasStatus, toggleStatusKemitraan, deleteUmkm } from "./actions";

interface UMKM {
  id: string;
  name: string;
  ownerName: string;
  district: string;
  phone: string;
  status: string | number;
  isUpgraded?: boolean | number;
  isNaikKelas?: boolean | number;
  logo?: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminUMKMPage() {
  const [data, setData] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  
  const getStatusLabel = (status: string | number | undefined): "Bermitra" | "Inkubator" => {
    if (status === "Bermitra" || status === 1 || status === "1") return "Bermitra";
    return "Inkubator";
  };

  
  const checkIsNaikKelas = (item: UMKM): boolean => {
    const val = item.isNaikKelas ?? item.isUpgraded;
    return val === true || val === 1;
  };

  const fetchUmkmData = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await getUmkms();
      setData((resData as UMKM[]) || []);
    } catch (err) {
      console.error("Gagal mengambil data UMKM:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUmkmData();
  }, [fetchUmkmData]);

  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return data;

    return data.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const ownerName = item.ownerName?.toLowerCase() || "";
      const district = item.district?.toLowerCase() || "";
      const phone = item.phone?.toString() || "";
      const statusLabel = getStatusLabel(item.status).toLowerCase();

      return (
        name.includes(query) ||
        ownerName.includes(query) ||
        district.includes(query) ||
        phone.includes(query) ||
        statusLabel.includes(query)
      );
    });
  }, [data, search]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  }, [filteredData.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  
  const totalUMKM = data.length;
  const totalBermitra = useMemo(() => {
    return data.filter((item) => getStatusLabel(item.status) === "Bermitra").length;
  }, [data]);
  const totalNaikKelas = useMemo(() => {
    return data.filter((item) => checkIsNaikKelas(item)).length;
  }, [data]);

  // ubah status kemitraan
  const handleToggleStatusKemitraan = (id: string, currentStatus: string | number, name: string) => {
    const isCurrentlyBermitra = getStatusLabel(currentStatus) === "Bermitra";
    const nextStatus = isCurrentlyBermitra ? "Inkubator" : "Bermitra";

    Swal.fire({
      title: `Ubah ke ${nextStatus}?`,
      text: nextStatus === "Bermitra"
        ? `UMKM "${name}" akan didaftarkan sebagai mitra.`
        : `Status kemitraan "${name}" akan diubah menjadi Inkubator.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nextStatus === "Bermitra" ? "#3B82F6" : "#A855F7",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Ya, Set ${nextStatus}!`,
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: nextStatus } : item
        )
      );

      try {
        const res = await toggleStatusKemitraan(id, nextStatus, name);
        if (res?.success) {
          Swal.fire({
            title: "Berhasil!",
            text: `Status Kemitraan "${name}" diperbarui ke ${nextStatus}.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          
          setData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: currentStatus } : item
            )
          );
          Swal.fire("Gagal!", res?.error || "Gagal mengubah status kemitraan.", "error");
        }
      } catch (error) {
        console.error(error);
        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: currentStatus } : item
          )
        );
        Swal.fire("Error!", "Terjadi kesalahan server.", "error");
      }
    });
  };

  // ubah status naik kelas
  const handleToggleNaikKelas = (id: string, currentIsNaik: boolean, name: string) => {
    const nextStatus = !currentIsNaik;

    Swal.fire({
      title: nextStatus ? "Set Naik Kelas?" : "Ubah ke Reguler?",
      text: `Apakah Anda yakin ingin mengubah status program "${name}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nextStatus ? "#10B981" : "#6B7280",
      cancelButtonColor: "#EF4444",
      confirmButtonText: nextStatus ? "Ya, Naik Kelas!" : "Ya, Kembalikan Reguler!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      // Optimistic update
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isNaikKelas: nextStatus } : item
        )
      );

      try {
        const res = await toggleNaikKelasStatus(id, nextStatus, name);

        if (res?.success) {
          Swal.fire({
            title: "Berhasil!",
            text: `Status program "${name}" berhasil diperbarui.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          // Rollback
          setData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, isNaikKelas: currentIsNaik } : item
            )
          );
          Swal.fire("Gagal!", res?.error || "Gagal memperbarui status.", "error");
        }
      } catch (error) {
        console.error(error);
        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isNaikKelas: currentIsNaik } : item
          )
        );
        Swal.fire("Error!", "Terjadi kesalahan server.", "error");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: "Hapus UMKM?",
      text: `Data "${name}" akan dihapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await deleteUmkm(id, name);

        if (res?.success) {
          setData((prev) => prev.filter((item) => item.id !== id));
          Swal.fire({
            title: "Terhapus!",
            text: "Data UMKM berhasil dihapus.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire("Gagal!", res?.error || "Gagal menghapus data.", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Terjadi kesalahan server.", "error");
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Manajemen UMKM</h1>
          <p className="text-sm text-gray-500">Kelola data pelaku usaha Kabupaten Bekasi</p>
        </div>
        <Link
          href="/admin/umkm/tambah"
          className="bg-primary hover:bg-[#2489b5] text-white px-5 py-2 rounded-full font-medium text-sm transition-all text-center sm:w-auto w-full flex items-center justify-center"
        >
          + Tambah UMKM
        </Link>
      </div>

      {/* card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* total */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group/card">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Total UMKM Terdaftar</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalUMKM}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover/card:scale-110 transition-transform shadow-xs">
            <Icon path={mdiDomain} size={1} />
          </div>
        </div>

        {/* mitra*/}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group/card">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">UMKM Bermitra</p>
            <h3 className="text-3xl font-black text-primary tracking-tight">{totalBermitra}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-medium/20 text-primary flex items-center justify-center border border-teal-medium/30 group-hover/card:scale-110 transition-transform shadow-xs">
            <Icon path={mdiHandshake} size={1} />
          </div>
        </div>

        {/* naik kelas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group/card">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">UMKM Naik Kelas</p>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{totalNaikKelas}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-light/30 text-primary flex items-center justify-center border border-teal-light/50 group-hover/card:scale-110 transition-transform shadow-xs">
            <Icon path={mdiTrendingUp} size={1} />
          </div>
        </div>
      </div>

      <div className="mb-6 relative w-full sm:w-96 md:w-112.5 group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-200 pointer-events-none flex items-center">
          <Icon path={mdiMagnify} size={0.85} />
        </div>

        <input
          type="text"
          placeholder="Cari berdasarkan nama umkm, pemilik, kecamatan"
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200/80 rounded-full text-xs sm:text-sm font-reguler text-slate-800 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-xs"
        />

        {search && (
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

      <div className="bg-secondary rounded-xl shadow-soft border border-gray-100 overflow-hidden p-4">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data...</div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {search ? "Data UMKM tidak ditemukan." : "Belum ada data UMKM."}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface border-b border-gray-100 text-gray-600">
                    <th className="p-4 font-semibold w-12 text-center">No.</th>
                    <th className="p-4 font-semibold">Nama UMKM</th>
                    <th className="p-4 font-semibold">Pemilik</th>
                    <th className="p-4 font-semibold">Kecamatan</th>
                    <th className="p-4 font-semibold">No. HP</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                    <th className="p-4 font-semibold text-center">Naik Kelas</th>
                    <th className="p-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => {
                    const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    const isNaik = checkIsNaikKelas(item);
                    const statusText = getStatusLabel(item.status);

                    return (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-surface/50">
                        <td className="p-4 text-center font-medium text-gray-500">{rowNumber}</td>
                        <td className="p-4 font-medium text-textMain">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.logo || "/default-logo.png"}
                              alt={item.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs shrink-0 bg-white"
                            />
                            <span className="font-medium text-textMain">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{item.ownerName}</td>
                        <td className="p-4 text-gray-600">{item.district}</td>
                        <td className="p-4 text-gray-600">{item.phone}</td>

                        {/* Status Kemitraan */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleStatusKemitraan(item.id, item.status, item.name)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              statusText === "Bermitra"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            }`}
                          >
                            {statusText}
                          </button>
                        </td>

                        {/* status naik kelas */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleNaikKelas(item.id, isNaik, item.name)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              isNaik
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {isNaik ? "Naik Kelas" : "Reguler"}
                          </button>
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <Link
                            href={`/admin/umkm/edit/${item.id}`}
                            className="text-teal-600 mb-1 hover:text-teal-800 font-medium text-xs px-2.5 py-1.5 bg-blue-50 rounded-full hover:bg-blue-100 transition-all inline-block"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs px-2.5 py-1.5 bg-red-50 rounded-full hover:bg-red-100 transition-all"
                          >
                            Hapus
                          </button>
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