"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiViewGridOutline, mdiMenu, mdiClose } from "@mdi/js";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/tentang" },
    { label: "Berita", href: "/berita" },
    { label: "Layanan", href: "/layanan" },
    { label: "Map UMKM", href: "/map" },
    { label: "Hubungi Kami", href: "/kontak" },
  ];

  
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-30 h-30 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden p-1.5">
            <Image 
              src="/logo.svg" 
              alt="Logo TEMU" 
              width={150} 
              height={150} 
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <div className="font-black text-base text-slate-900 tracking-wider leading-none">
              TEMU
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Terintegrasi UMKM
            </div>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-7 h-full text-sm font-medium">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center h-full transition-colors hover:text-primary ${
                  active ? "text-primary font-semibold" : "text-gray-600"
                }`}
              >
                {item.label}
                
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-0.75 bg-primary rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>


        <div className="hidden md:flex items-center">
          <Link
            href="/katalog"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 text-sm"
          >
            <Icon path={mdiViewGridOutline} size={0.8} />
            <span>Katalog UMKM</span>
          </Link>
        </div>


        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-primary focus:outline-none"
          aria-label="Toggle menu"
        >
          <Icon path={isOpen ? mdiClose : mdiMenu} size={1} />
        </button>
      </div>


      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 pt-3 pb-6 space-y-3 shadow-lg">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between py-2 text-sm font-medium transition-colors ${
                  active ? "text-primary font-bold" : "text-gray-600"
                }`}
              >
                <span>{item.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/katalog"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm"
            >
              <Icon path={mdiViewGridOutline} size={0.8} />
              <span>Katalog UMKM</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}