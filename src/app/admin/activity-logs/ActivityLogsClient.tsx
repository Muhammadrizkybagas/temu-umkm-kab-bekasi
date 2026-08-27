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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Icon path={mdiHistory} size={1} className="text-blue-600" /> Log Aktivitas Admin
          </h1>
          <p className="text-sm text-gray-500">
            Audit trail pencatatan seluruh tindakan pembuatan, perbaikan, dan penghapusan data.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
          >
            <Icon path={mdiDeleteSweepOutline} size={0.7} /> Bersihkan Log
          </button>
        )}
      </div>

      {/* Tabel Log */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3.5">Aktor / Admin</th>
                <th className="px-6 py-3.5">Tindakan</th>
                <th className="px-6 py-3.5">Deskripsi Aktivitas</th>
                <th className="px-6 py-3.5">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Belum ada riwayat aktivitas tercatat.
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div>{log.userName}</div>
                      <div className="text-xs text-gray-400 font-normal">{log.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{log.description}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {logs.length > 0 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              Menampilkan <span className="font-semibold text-gray-900">{startIndex + 1}</span>–
              <span className="font-semibold text-gray-900">
                {Math.min(endIndex, logs.length)}
              </span>{" "}
              dari <span className="font-semibold text-gray-900">{logs.length}</span> log aktivitas
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Icon path={mdiChevronLeft} size={0.6} /> Sebelumnya
              </button>

              <div className="px-3 py-1 text-gray-700 font-semibold bg-white border border-gray-200 rounded-lg">
                {currentPage} / {totalPages || 1}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Selanjutnya <Icon path={mdiChevronRight} size={0.6} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}