"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Icon from "@mdi/react";
import { 
  mdiMenu, 
  mdiClose, 
  mdiViewDashboardOutline, 
  mdiFolderOutline, 
  mdiStorefrontOutline, 
  mdiPackageVariant, 
  mdiNewspaperVariantOutline, 
  mdiLogout, 
  mdiImageOutline,
  mdiAccountMultipleOutline,
  mdiMessageOutline,
  mdiAccountEyeOutline,
  mdiCogOutline,
  mdiHandshakeOutline
} from "@mdi/js";

interface AdminSidebarProps {
  children: React.ReactNode;
  userRole?: string;
}

export default function AdminSidebar({ children, userRole: initialRole = "" }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rawRole, setRawRole] = useState(initialRole);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (initialRole) {
      setRawRole(initialRole);
    } else if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role") || "";
      setRawRole(storedRole);
    }

    const fetchUnreadMessages = async () => {
      try {
        const res = await fetch("/api/admin/messages/unread-count"); 
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        
      }
    };

    fetchUnreadMessages();
  }, [initialRole]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") localStorage.clear();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const getNormalizedRole = (roleStr: string) => {
    const clean = (roleStr || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.includes("super")) return "super_admin";
    if (clean.includes("kontributor")) return "kontributor_berita";
    if (clean.includes("admin")) return "admin";
    return "";
  };

  const currentRole = getNormalizedRole(rawRole);

  const menuItems = [
    { 
      label: "Dashboard", 
      href: "/admin/dashboard", 
      icon: mdiViewDashboardOutline, 
      roles: ["super_admin", "admin", "kontributor_berita"] 
    },
    { 
      label: "Manajemen Kategori", 
      href: "/admin/kategori", 
      icon: mdiFolderOutline, 
      roles: ["super_admin", "admin"] 
    },
    { 
      label: "Manajemen UMKM", 
      href: "/admin/umkm", 
      icon: mdiStorefrontOutline, 
      roles: ["super_admin", "admin"] 
    },
    { 
      label: "Manajemen Mitra", 
      href: "/admin/mitra", 
      icon: mdiHandshakeOutline,
      roles: ["super_admin", "admin"] 
    },
    { 
      label: "Manajemen Produk", 
      href: "/admin/produk", 
      icon: mdiPackageVariant, 
      roles: ["super_admin", "admin"] 
    },
    { 
      label: "Manajemen Berita", 
      href: "/admin/berita", 
      icon: mdiNewspaperVariantOutline, 
      roles: ["super_admin", "admin", "kontributor_berita"] 
    },
    { 
      label: "Manajemen Banner", 
      href: "/admin/banner", 
      icon: mdiImageOutline, 
      roles: ["super_admin", "admin", "kontributor_berita"] 
    },
    { 
      label: "Manajemen User", 
      href: "/admin/users", 
      icon: mdiAccountMultipleOutline, 
      roles: ["super_admin"] 
    },
    { 
      label: "Kotak Masuk", 
      href: "/admin/messages", 
      icon: mdiMessageOutline, 
      roles: ["super_admin", "admin"],
      badge: unreadCount > 0 ? unreadCount : null
    },
    { 
      label: "Pengaturan Situs", 
      href: "/admin/settings", 
      icon: mdiCogOutline, 
      roles: ["super_admin", "admin"] 
    },
    { 
      label: "Log Aktivitas", 
      href: "/admin/activity-logs", 
      icon: mdiAccountEyeOutline, 
      roles: ["super_admin"] 
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <div className="min-h-screen w-full bg-surface flex flex-col lg:flex-row overflow-x-hidden">
      
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}


      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-100 p-6 
        flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.svg" 
                alt="Logo TEMU" 
                width={90} 
                height={90} 
                className="object-contain"
              />
              <div className="flex flex-col">
                {/* <span className="font-black text-base text-slate-900 tracking-wider leading-none">TEMU</span> */}
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Terintegrasi UMKM</span>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Icon path={mdiClose} size={1} />
            </button>
          </div>

          <nav className="space-y-1.5">
            {filteredMenu.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-full text-[14px] font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon path={item.icon} size={0.85} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                      isActive ? "bg-white text-primary" : "bg-red-500 text-white"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-extrabold text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
        >
          <Icon path={mdiLogout} size={0.85} />
          <span>Keluar</span>
        </button>
      </aside>


      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Image 
              src="/logo.svg" 
              alt="Logo TEMU" 
              width={28} 
              height={28} 
              className="object-contain"
            />  
            <div className="flex flex-col">
              {/* <span className="font-medium text-sm text-slate-900 tracking-wider leading-none">TEMU</span> */}
              <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Terintegrasi UMKM</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Icon path={sidebarOpen ? mdiClose : mdiMenu} size={1.2} />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}