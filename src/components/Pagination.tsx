"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
}: PaginationProps) {
  if (totalItems <= pageSize) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Algoritma pemotong angka halaman (Ellipsis)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Jumlah angka di kiri & kanan halaman aktif

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        pages.push("...");
      }
    }

    // Filter agar titik-titik ("...") tidak muncul ganda secara berurutan
    return pages.filter((item, index, array) => item !== array[index - 1]);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
      {/* Informasi Data */}
      <div>
        Menampilkan <span className="font-semibold text-gray-800">{startItem}</span> -{" "}
        <span className="font-semibold text-gray-800">{endItem}</span> dari{" "}
        <span className="font-semibold text-gray-800">{totalItems}</span> data
      </div>

      {/* Kontrol Navigasi */}
      <div className="flex items-center gap-1 selection:bg-none">
        {/* Tombol Sebelumnya */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Sebelumnya
        </button>

        {/* List Angka dengan Ellipsis */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 font-medium"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Tombol Selanjutnya */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}