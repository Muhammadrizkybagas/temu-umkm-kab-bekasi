"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiEmailOutline,
  mdiEmailOpenOutline,
  mdiTrashCanOutline,
  mdiWhatsapp,
  mdiMagnify,
  mdiFilterVariant,
  mdiAccountOutline,
  mdiPhoneOutline,
  mdiCalendarClockOutline
} from "@mdi/js";
import { updateMessageStatus, deleteMessage } from "./actions";

type MessageItem = {
  id: string;
  name: string;
  phone?: string | null;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export default function MessageManagementClient({
  initialMessages,
}: {
  initialMessages: MessageItem[];
}) {
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  
  const countAll = initialMessages.length;
  const countUnread = initialMessages.filter((m) => m.status === "UNREAD").length;
  const countRead = initialMessages.filter((m) => m.status === "READ").length;
  const countReplied = initialMessages.filter((m) => m.status === "REPLIED").length;

  
  const filteredMessages = initialMessages.filter((msg) => {
    const matchesStatus = 
      filterStatus === "ALL" || msg.status === filterStatus;
      
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.phone && msg.phone.includes(searchQuery));

    return matchesStatus && matchesSearch;
  });

  
  const handleOpenDetail = async (msg: MessageItem) => {
    setSelectedMessage(msg);
    if (msg.status === "UNREAD") {
      await updateMessageStatus(msg.id, "READ");
    }
  };

  
  const handleReplyWhatsApp = async () => {
    if (!selectedMessage) return;
    
    let rawPhone = selectedMessage.phone || "";
    let cleanPhone = rawPhone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }

    const defaultText = `Halo ${selectedMessage.name}, terima kasih telah menghubungi UMKM Bekasi mengenai "${selectedMessage.subject}". Pesan Anda telah kami terima.`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;
    
    window.open(waUrl, "_blank");
    await updateMessageStatus(selectedMessage.id, "REPLIED");
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;
    await deleteMessage(selectedMessage.id);
    setSelectedMessage(null);
    setIsDeleteOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UNREAD":
        return <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">Belum Dibaca</span>;
      case "READ":
        return <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">Sudah Dibaca</span>;
      case "REPLIED":
        return <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">Sudah Dibalas</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pesan & Kontak Masuk</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Kelola pertanyaan dan umpan balik dari pengunjung website UMKM Bekasi.
          </p>
        </div>
      </div>


      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-full border border-slate-100 shadow-sm">
          {[
            { label: "Semua", value: "ALL", count: countAll },
            { label: "Belum Dibaca", value: "UNREAD", count: countUnread },
            { label: "Dibaca", value: "READ", count: countRead },
            { label: "Dibalas", value: "REPLIED", count: countReplied },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                filterStatus === tab.value
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[12px] font-bold ${
                  filterStatus === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* search */}
        <div className="bg-white px-4 py-2.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-3 md:w-80">
          <Icon path={mdiMagnify} size={0.8} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari pesan, nama, atau nomor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100 max-h-150 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold">
              Tidak ada pesan masuk yang sesuai.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isUnread = msg.status === "UNREAD";

              return (
                <div
                  key={msg.id}
                  onClick={() => handleOpenDetail(msg)}
                  className={`p-4 cursor-pointer transition-all flex items-start gap-3.5 relative ${
                    isSelected
                      ? "bg-primary/5 border-l-4 border-primary"
                      : isUnread
                      ? "bg-slate-50/80 font-bold hover:bg-slate-100/60"
                      : "bg-white hover:bg-slate-50/60 text-slate-600"
                  }`}
                >
                  <div className={`mt-1 p-2 rounded-xl shrink-0 ${isUnread ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                    <Icon
                      path={isUnread ? mdiEmailOutline : mdiEmailOpenOutline}
                      size={0.75}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-extrabold text-slate-900 truncate">{msg.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })
                          : ""}
                      </span>
                    </div>
                    <p className={`text-xs truncate mb-1 ${isUnread ? "font-extrabold text-slate-800" : "font-semibold text-slate-700"}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* panel detail */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>{getStatusBadge(selectedMessage.status)}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReplyWhatsApp}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Icon path={mdiWhatsapp} size={0.75} />
                    Balas WhatsApp
                  </button>
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="w-9 h-9 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-2xl transition-all flex items-center justify-center cursor-pointer"
                    title="Hapus Pesan"
                  >
                    <Icon path={mdiTrashCanOutline} size={0.75} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{selectedMessage.subject}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 pb-1 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Icon path={mdiAccountOutline} size={0.7} className="text-slate-400 shrink-0" />
                    <span>Pengirim: <strong className="text-slate-800">{selectedMessage.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Icon path={mdiPhoneOutline} size={0.7} className="text-emerald-600 shrink-0" />
                    <span>WhatsApp: <strong className="text-emerald-700">{selectedMessage.phone || "-"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:col-span-2">
                    <Icon path={mdiCalendarClockOutline} size={0.7} className="text-slate-400 shrink-0" />
                    <span>Waktu: {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" }) : "-"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                {selectedMessage.message}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 shadow-sm flex flex-col items-center justify-center min-h-100">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                <Icon path={mdiEmailOpenOutline} size={1.2} />
              </div>
              <p className="text-xs font-extrabold text-slate-400">Pilih pesan di sebelah kiri untuk melihat detail isi pesan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Hapus */}
      {isDeleteOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-5 shadow-xl border border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Hapus Pesan</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus pesan dari <strong>{selectedMessage.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}