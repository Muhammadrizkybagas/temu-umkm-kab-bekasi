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
  mdiHandshakeOutline,
  mdiAccountCircle,
  mdiContentSave,
  mdiLoading,
  mdiLock,
  mdiEmail,
  mdiAccount,
  mdiShieldCheck,
  mdiPencil,
  mdiArrowLeft,
  mdiChevronDown
} from "@mdi/js";
import Swal from "sweetalert2";
import { updateAdminProfile } from "@/app/admin/profile/actions";
import AdminHeader from "@/components/AdminHeader";

interface UserProps {
  id?: string; 
  name?: string;
  email?: string;
  role?: string;
}

interface AdminSidebarProps {
  children: React.ReactNode;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  userRole?: string;
}

// 
export default function AdminSidebar({ children, user, userRole: initialRole = "" }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rawRole, setRawRole] = useState(initialRole || user?.role || "");
  const [unreadCount, setUnreadCount] = useState(0);

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    manajemenData: true, 
    kelolaKonten: false,
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProps>(
    user || { id: "", name: "Admin", email: "-", role: "admin" }
  );

  useEffect(() => {
    if (user) setUserProfile(user);
    if (initialRole) setRawRole(initialRole);
    else if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role") || "";
      if (storedRole) setRawRole(storedRole);
    }

    const fetchUnreadMessages = async () => {
      try {
        const res = await fetch("/api/admin/messages/unread-count"); 
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch (error) {}
    };

    fetchUnreadMessages();
  }, [initialRole, user]);

  const [form, setForm] = useState({
    name: userProfile.name || "",
    email: userProfile.email || "",
    newPassword: "",
    confirmPassword: "",
  });

  const getRoleConfig = (roleStr: string) => {
    const norm = (roleStr || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (norm.includes("super")) {
      return { label: "Super Admin", badge: "bg-purple-100 text-purple-700 border-purple-200" };
    }
    if (norm.includes("kontributor")) {
      return { label: "Kontributor Berita", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    }
    return { label: "Administrator", badge: "bg-blue-100 text-blue-700 border-blue-200" };
  };

  const roleConfig = getRoleConfig(userProfile.role || rawRole);

  const handleOpenDrawer = () => {
    setForm({
      name: userProfile.name || "",
      email: userProfile.email || "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setIsProfileOpen(true);
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userProfile.id) {
      Swal.fire("Error", "Sesi login tidak terdeteksi. Silakan refresh.", "error");
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      Swal.fire("Peringatan", "Konfirmasi kata sandi tidak cocok!", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateAdminProfile({
        id: userProfile.id,
        name: form.name,
        email: form.email,
        newPassword: form.newPassword || undefined,
      });

      if (!res.success) throw new Error(res.error);

      setUserProfile((prev) => ({ ...prev, name: form.name, email: form.email }));
      setIsEditing(false);

      Swal.fire({
        title: "Berhasil!",
        text: "Profil berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire("Error", err.message || "Gagal memperbarui profil", "error");
    } finally {
      setSubmitting(false);
    }
  };

const handleLogout = async () => {
  try {
    // hapus sesi
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    // hapus cookie auth_token
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Gagal logout dari API server:", error);
  } finally {
    // redirect ke halaman login
    router.push("/login");
    router.refresh();
  }
};

  const getNormalizedRole = (roleStr: string) => {
    const clean = (roleStr || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.includes("super")) return "super_admin";
    if (clean.includes("kontributor")) return "kontributor_berita";
    if (clean.includes("admin")) return "admin";
    return "";
  };

  const currentRole = getNormalizedRole(rawRole);

  type MenuChild = {
    label: string;
    href: string;
    icon: string;
    roles: string[];
  };

  type MenuItem =
    | {
        type: "single";
        label: string;
        href: string;
        icon: string;
        roles: string[];
        badge?: number | null;
      }
    | {
        type: "group";
        key: string;
        label: string;
        icon: string;
        roles: string[];
        children: MenuChild[];
      };

  const menuConfig: MenuItem[] = [
    { 
      type: "single",
      label: "Dashboard", 
      href: "/admin/dashboard", 
      icon: mdiViewDashboardOutline, 
      roles: ["super_admin", "admin", "kontributor_berita"] 
    },
    {
      type: "group",
      key: "manajemenData",
      label: "Manajemen Data",
      icon: mdiStorefrontOutline,
      roles: ["super_admin", "admin"],
      children: [
        { label: "Manajemen Kategori", href: "/admin/kategori", icon: mdiFolderOutline, roles: ["super_admin", "admin"] },
        { label: "Manajemen UMKM", href: "/admin/umkm", icon: mdiStorefrontOutline, roles: ["super_admin", "admin"] },
        { label: "Manajemen Mitra", href: "/admin/mitra", icon: mdiHandshakeOutline, roles: ["super_admin", "admin"] },
        { label: "Manajemen Produk", href: "/admin/produk", icon: mdiPackageVariant, roles: ["super_admin", "admin"] },
      ],
    },
    {
      type: "group",
      key: "kelolaKonten",
      label: "Kelola Konten & Web",
      icon: mdiNewspaperVariantOutline,
      roles: ["super_admin", "admin", "kontributor_berita"],
      children: [
        { label: "Manajemen Berita", href: "/admin/berita", icon: mdiNewspaperVariantOutline, roles: ["super_admin", "admin", "kontributor_berita"] },
        { label: "Manajemen Banner", href: "/admin/banner", icon: mdiImageOutline, roles: ["super_admin", "admin", "kontributor_berita"] },
        { label: "Pengaturan Situs", href: "/admin/settings", icon: mdiCogOutline, roles: ["super_admin", "admin"] },
      ],
    },
    { 
      type: "single",
      label: "Manajemen User", 
      href: "/admin/users", 
      icon: mdiAccountMultipleOutline, 
      roles: ["super_admin"] 
    },
    { 
      type: "single",
      label: "Kotak Masuk", 
      href: "/admin/messages", 
      icon: mdiMessageOutline, 
      roles: ["super_admin", "admin"], 
      badge: unreadCount > 0 ? unreadCount : null 
    },
    { 
      type: "single",
      label: "Log Aktivitas", 
      href: "/admin/activity-logs", 
      icon: mdiAccountEyeOutline, 
      roles: ["super_admin"] 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader user={user} onMenuClick={() => setSidebarOpen(true)} />
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Utama */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-100 p-5 
        flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div>
          {/* Logo*/}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Logo TEMU" width={80} height={80} className="object-contain" />
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-teal-500 uppercase tracking-wider">
                  Terintegrasi UMKM
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Icon path={mdiClose} size={0.8} />
            </button>
          </div>

          {/* Header Label */}
          <div className="px-2 mb-3">
            <span className="text-[12px] font-semibold tracking-wider text-slate-400 uppercase">
              OVERVIEW
            </span>
          </div>

          {/* Menu & Submenu */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {menuConfig.map((item) => {
              if (!item.roles.includes(currentRole)) return null;

              // Menu Utama Biasa
              if (item.type === "single") {
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-teal-light/25 text-primary font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Icon path={item.icon} size={0.7} />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-2 py-0.5 text-[12px] font-bold rounded-full bg-red-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              }

              // Dropdown Submenu
              if (item.type === "group") {
                const filteredChildren = item.children.filter((child) => child.roles.includes(currentRole));
                if (filteredChildren.length === 0) return null;

                const isExpanded = openSubmenus[item.key];
                const hasActiveChild = filteredChildren.some((child) => pathname.startsWith(child.href));

                return (
                  <div key={item.key} className="space-y-1">
                    {/* Header Submenu */}
                    <button
                      onClick={() => toggleSubmenu(item.key)}
                      className={`w-full flex items-center justify-between px-3 text-left py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                        hasActiveChild || isExpanded
                          ? "bg-slate-50 text-primary"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          hasActiveChild ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          <Icon path={item.icon} size={0.7} />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <Icon
                        path={mdiChevronDown}
                        size={0.75}
                        className={`text-slate-400 transition-transform duration-300 ease-in-out ${
                          isExpanded ? "rotate-180 text-primary" : "rotate-0"
                        }`}
                      />
                    </button>

                    {/* Submenu Items */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isExpanded ? "grid-rows-[1fr] opacity-100 my-1" : "grid-rows-[0fr] opacity-0 my-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pl-6 space-y-1 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
                          {filteredChildren.map((child) => {
                            const isChildActive = pathname.startsWith(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 text-[12px] rounded-lg font-normal transition-colors relative ${
                                  isChildActive
                                    ? "text-primary font-semibold bg-teal-light/20"
                                    : "text-slate-500 hover:text-primary hover:bg-slate-50"
                                }`}
                              >
                                <span
                                  className={`w-2 h-[1.5px] rounded-full transition-colors ${
                                    isChildActive ? "bg-primary" : "bg-slate-200"
                                  }`}
                                />
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </nav>
        </div>

        {/* Bagian Tombol Logout */}
        {/* <div className="shrink-0 pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-red-600 bg-red-50/60 hover:bg-red-100/70 hover:text-red-700 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <div className="p-1 bg-red-100 rounded-lg">
              <Icon path={mdiLogout} size={0.65} className="text-red-600" />
            </div>
            <span>Keluar Sistem</span>
          </button>
        </div> */}
      </aside>

      <div className="lg:pl-64 pt-16 transition-all duration-300">
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}