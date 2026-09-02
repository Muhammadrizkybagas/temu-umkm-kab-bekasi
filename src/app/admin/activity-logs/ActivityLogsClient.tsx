"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiHistory,
  mdiPlusCircleOutline,
  mdiPencilOutline,
  mdiTrashCanOutline,
  mdiShieldAccountOutline,
  mdiDeleteSweepOutline,
  mdiChevronLeft,
  mdiChevronRight,
} from "@mdi/js";
import Swal from "sweetalert2";
import { clearActivityLogs } from "./actions";

type LogItem = {
  id: string;
  userName: string;
  userEmail: string;
  action: string;
  description: string;
  createdAt: Date | null;
};

export default function ActivityLogsClient({ initialLogs }: { initialLogs: LogItem[] }) {
  const [logs, setLogs] = useState(initialLogs);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
            <Icon path={mdiPlusCircleOutline} size={0.55} /> TAMBAH
          </span>
        );
      case "UPDATE":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
            <Icon path={mdiPencilOutline} size={0.55} /> EDIT
          </span>
        );
      case "DELETE":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
            <Icon path={mdiTrashCanOutline} size={0.55} /> HAPUS
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
            <Icon path={mdiShieldAccountOutline} size={0.55} /> SYSTEM
          </span>
        );
    }
  };

  const handleClearLogs = async () => {
    const res = await Swal.fire({
      title: "Bersihkan Riwayat Log?",
      text: "Seluruh riwayat aktivitas admin akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, Hapus Semua",
    });

    if (res.isConfirmed) {
      await clearActivityLogs();
      setLogs([]);
      setCurrentPage(1);
      Swal.fire("Berhasil", "Riwayat log telah dibersihkan.", "success");
    }
  };

return (
    <div className="max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Icon path={mdiHistory} size={1} className="text-primary" /> Log Aktivitas Admin
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Audit trail pencatatan seluruh tindakan pembuatan, perbaikan, dan penghapusan data.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-normal bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
          >
            <Icon path={mdiDeleteSweepOutline} size={0.7} /> Bersihkan Log
          </button>
        )}
      </div>

      {/* Tabel Log */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {logs.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-1">
                <Icon path={mdiHistory} size={1.2} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Belum ada riwayat aktivitas tercatat.</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left text-xs border-collapse min-w-162.5">
                  <thead>
                    <tr className="bg-primary text-white font-semibold text-[14px]">
                      <th className="p-3.5 font-normal">Role</th>
                      <th className="p-3.5 font-normal">Tindakan</th>
                      <th className="p-3.5 font-normal">Deskripsi Aktivitas</th>
                      <th className="p-3.5 font-normal">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLogs.map((log, index) => {
                      const isEven = index % 2 === 1;

                      return (
                        <tr 
                          key={log.id} 
                          className={`border-b border-slate-100 transition-colors ${
                            isEven ? "bg-teal-light/15 hover:bg-teal-light/30" : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          <td className="p-3.5 font-normal text-slate-800">
                            <div>{log.userName}</div>
                            <div className="text-xs text-slate-400 font-normal mt-0.5">{log.userEmail}</div>
                          </td>
                          <td className="p-3.5 font-normal whitespace-nowrap">{getActionBadge(log.action)}</td>
                          <td className="p-3.5 text-slate-800 font-normal">{log.description}</td>
                          <td className="p-3.5 text-xs text-slate-600 whitespace-nowrap font-normal">
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString("id-ID", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "-"}
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

        {logs.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Menampilkan <span className="font-bold text-slate-700">{startIndex + 1}</span>–
              <span className="font-bold text-slate-700">
                {Math.min(endIndex, logs.length)}
              </span>{" "}
              dari <span className="font-bold text-slate-700">{logs.length}</span> log aktivitas
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-normal cursor-pointer"
              >
                <Icon path={mdiChevronLeft} size={0.6} /> Prev
              </button>

              <div className="px-3 py-1 text-slate-700 font-bold bg-white border border-slate-200 rounded-lg">
                {currentPage} / {totalPages || 1}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-normal cursor-pointer"
              >
                Next <Icon path={mdiChevronRight} size={0.6} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}