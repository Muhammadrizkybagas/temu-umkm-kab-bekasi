"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import { mdiStorefront, mdiBookOpenVariant } from "@mdi/js";

export default function MobileFloatingShortcut() {
  const pathname = usePathname();

  const isEbookPage = pathname?.startsWith("/katalog/ebook");
  const isKatalogPage = pathname === "/katalog" || (pathname?.startsWith("/katalog") && !isEbookPage);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 lg:hidden px-2.5 py-2 bg-slate-900/85 backdrop-blur-md rounded-full shadow-2xl border border-white/20 animate-bounce w-max max-w-[92vw]">
      {/* E-Katalog */}
      {!isKatalogPage && (
        <Link
          href="/katalog"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-[#28726e] text-white text-[14px] font-normal rounded-full shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          <Icon path={mdiStorefront} size={1} />
          <span>E-Katalog</span>
        </Link>
      )}

      {/* E-Book */}
      {!isEbookPage && (
        <Link
          href="/katalog/ebook"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-normal rounded-full shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          <Icon path={mdiBookOpenVariant} size={1} />
          <span>E-Book</span>
        </Link>
      )}
    </div>
  );
}