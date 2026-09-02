"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Icon from "@mdi/react";
import {
  mdiHandshake,
  mdiStorefrontOutline,
  mdiMagnify,
  mdiPencilOutline,
  mdiClose,
  mdiCheckCircle,
  mdiFilterVariant,
  mdiChevronDown
} from "@mdi/js";
import { updateUmkmPartnersAction } from "./actions";
import Pagination from "@/components/Pagination";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}

interface UmkmWithPartners {
  id: string;
  name: string;
  ownerName: string;
  district: string;
  phone: string;
  partners: {
    partner: Partner;
  }[];
}

interface MitraClientProps {
  initialPartners: Partner[];
  initialUmkms: UmkmWithPartners[];
}

export default function MitraClient({ initialPartners, initialUmkms }: MitraClientProps) {
  const [search, setSearch] = useState("");
  const [selectedPartnerFilter, setSelectedPartnerFilter] = useState<string>("ALL");
  const [activeUmkm, setActiveUmkm] = useState<UmkmWithPartners | null>(null);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedPartnerFilter]);

  const partnerCounts = useMemo(() => {
    return initialPartners.map((partner) => {
      const count = initialUmkms.filter((u) =>
        u.partners.some((p) => p.partner.id === partner.id)
      ).length;
      return { ...partner, count };
    });
  }, [initialPartners, initialUmkms]);

  // filter cari
  const filteredUmkms = useMemo(() => {
    return initialUmkms.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(search.toLowerCase()) ||
        item.district.toLowerCase().includes(search.toLowerCase());

      const matchPartner =
        selectedPartnerFilter === "ALL"
          ? true
          : selectedPartnerFilter === "NONE"
          ? item.partners.length === 0
          : item.partners.some((p) => p.partner.id === selectedPartnerFilter);

      return matchSearch && matchPartner;
    });
  }, [initialUmkms, search, selectedPartnerFilter]);

  // pagination
  const totalItems = filteredUmkms.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedUmkms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUmkms.slice(start, start + pageSize);
  }, [filteredUmkms, currentPage, pageSize]);

  const openEditModal = (umkmItem: UmkmWithPartners) => {
    setActiveUmkm(umkmItem);
    setSelectedPartnerIds(umkmItem.partners.map((p) => p.partner.id));
  };

  const togglePartnerSelection = (partnerId: string) => {
    if (selectedPartnerIds.includes(partnerId)) {
      setSelectedPartnerIds((prev) => prev.filter((id) => id !== partnerId));
    } else {
      setSelectedPartnerIds((prev) => [...prev, partnerId]);
    }
  };

  const handleSavePartners = async () => {
    if (!activeUmkm) return;
    setLoading(true);

    const res = await updateUmkmPartnersAction(activeUmkm.id, selectedPartnerIds, activeUmkm.name);
    setLoading(false);

    if (res.success) {
      setActiveUmkm(null);
    } else {
      alert(res.error || "Terjadi kesalahan saat menyimpan.");
    }
  };

return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Manajemen Mitra Ritel UMKM
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Kelola distribusi penempatan produk UMKM pada jaringan ritel modern.
        </p>
      </div>

      {/* statistik mitra */}
      <div className="flex flex-wrap justify-center gap-3">
        {partnerCounts.map((partner) => (
          <div
            key={partner.id}
            onClick={() =>
              setSelectedPartnerFilter((prev) => (prev === partner.id ? "ALL" : partner.id))
            }
            className={`w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(16.666%-10px)] p-3.5 rounded-xl border bg-white transition-all cursor-pointer shadow-2xs ${
              selectedPartnerFilter === partner.id
                ? "border-primary ring-2 ring-primary/10 bg-primary/5"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="relative w-7 h-7">
                <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
              </div>
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {partner.count}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-800 truncate">{partner.name}</p>
            <p className="text-[10px] text-gray-400">UMKM Terdaftar</p>
          </div>
        ))}
      </div>

      {/* filter cari */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="relative w-full md:w-96 group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-200 pointer-events-none flex items-center">
            <Icon path={mdiMagnify} size={0.85} />
          </div>

          <input
            type="text"
            placeholder="Cari UMKM, Pemilik, atau Kecamatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-full text-xs sm:text-sm font-normal text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-2xs"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
              title="Bersihkan pencarian"
            >
              <Icon path={mdiClose} size={0.55} />
            </button>
          )}
        </div>

        {/* dropdown mitra */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
              <Icon path={mdiFilterVariant} size={0.75} />
            </div>

            <select
              value={selectedPartnerFilter}
              onChange={(e) => setSelectedPartnerFilter(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-full text-xs sm:text-sm font-normal text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all cursor-pointer appearance-none shadow-2xs"
            >
              <option value="ALL">Semua Mitra Ritel</option>
              <option value="NONE">Belum Memiliki Ritel</option>
              {initialPartners.map((p) => (
                <option key={p.id} value={p.id}>
                  Ritel: {p.name}
                </option>
              ))}
            </select>

            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
              <Icon path={mdiChevronDown} size={0.75} />
            </div>
          </div>
        </div>
      </div>

      {/* tabel */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-soft p-4">
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-white font-normal">
                <th className="p-3.5 font-normal w-12 text-center">No.</th>
                <th className="p-3.5 font-normal">Nama UMKM</th>
                <th className="p-3.5 font-normal">Pemilik</th>
                <th className="p-3.5 font-normal">Kecamatan</th>
                <th className="p-3.5 font-normal">Mitra Ritel Terdaftar</th>
                <th className="p-3.5 font-normal text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUmkms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 font-normal">
                    Tidak ada UMKM bermitra yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedUmkms.map((item, index) => {
                  const rowNumber = (currentPage - 1) * pageSize + index + 1;
                  const isEven = index % 2 === 1;

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-slate-100 transition-colors ${
                        isEven ? "bg-teal-light/15 hover:bg-teal-light/30" : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <td className="p-3.5 text-center font-normal text-slate-500">{rowNumber}</td>
                      <td className="p-3.5 font-normal text-slate-800">{item.name}</td>
                      <td className="p-3.5 text-slate-600 font-normal">{item.ownerName}</td>
                      <td className="p-3.5 text-slate-600 font-normal">{item.district}</td>
                      <td className="p-3.5 text-slate-600 font-normal">
                        {item.partners.length === 0 ? (
                          <span className="text-[11px] text-gray-400 italic">Belum disetting</span>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.partners.map((p) => (
                              <div
                                key={p.partner.id}
                                title={p.partner.name}
                                className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-2xs"
                              >
                                <div className="relative w-4 h-4">
                                  <Image
                                    src={p.partner.logoUrl}
                                    alt={p.partner.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <span className="text-[10px] font-normal text-slate-700">
                                  {p.partner.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-teal-700 text-white text-xs font-normal rounded-full transition-colors cursor-pointer"
                        >
                          <Icon path={mdiPencilOutline} size={0.6} />
                          Kelola Mitra
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* modal manajemen mitra */}
      {activeUmkm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Kelola Mitra Ritel</h3>
                <p className="text-xs text-gray-500">
                  UMKM: <strong className="text-gray-800">{activeUmkm.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveUmkm(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 cursor-pointer"
              >
                <Icon path={mdiClose} size={0.8} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-600">
                Pilih jaringan ritel modern yang saat ini telah menerima/memasarkan produk UMKM ini:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {initialPartners.map((partner) => {
                  const isChecked = selectedPartnerIds.includes(partner.id);
                  return (
                    <div
                      key={partner.id}
                      onClick={() => togglePartnerSelection(partner.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                        isChecked
                          ? "border-primary bg-primary/5 shadow-2xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="relative w-6 h-6 shrink-0">
                        <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 flex-1 truncate">
                        {partner.name}
                      </span>
                      {isChecked && (
                        <Icon path={mdiCheckCircle} size={0.7} className="text-primary shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

              {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
              <button
                onClick={() => setActiveUmkm(null)}
                className="px-4 py-2 text-xs font-medium bg-red-500 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSavePartners}
                disabled={loading}
                className="px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Kemitraan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}