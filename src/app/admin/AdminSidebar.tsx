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
} from "@mdi/js";
import Swal from "sweetalert2";
import { updateAdminProfile } from "@/app/admin/profile/actions";

interface UserProps {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AdminSidebarProps {
  children: React.ReactNode;
  user?: UserProps;
  userRole?: string;
}

export default function AdminSidebar({ children, user, userRole: initialRole = "" }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rawRole, setRawRole] = useState(initialRole || user?.role || "");
  const [unreadCount, setUnreadCount] = useState(0);

  
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
    { label: "Dashboard", href: "/admin/dashboard", icon: mdiViewDashboardOutline, roles: ["super_admin", "admin", "kontributor_berita"] },
    { label: "Manajemen Kategori", href: "/admin/kategori", icon: mdiFolderOutline, roles: ["super_admin", "admin"] },
    { label: "Manajemen UMKM", href: "/admin/umkm", icon: mdiStorefrontOutline, roles: ["super_admin", "admin"] },
    { label: "Manajemen Mitra", href: "/admin/mitra", icon: mdiHandshakeOutline, roles: ["super_admin", "admin"] },
    { label: "Manajemen Produk", href: "/admin/produk", icon: mdiPackageVariant, roles: ["super_admin", "admin"] },
    { label: "Manajemen Berita", href: "/admin/berita", icon: mdiNewspaperVariantOutline, roles: ["super_admin", "admin", "kontributor_berita"] },
    { label: "Manajemen Banner", href: "/admin/banner", icon: mdiImageOutline, roles: ["super_admin", "admin", "kontributor_berita"] },
    { label: "Manajemen User", href: "/admin/users", icon: mdiAccountMultipleOutline, roles: ["super_admin"] },
    { label: "Kotak Masuk", href: "/admin/messages", icon: mdiMessageOutline, roles: ["super_admin", "admin"], badge: unreadCount > 0 ? unreadCount : null },
    { label: "Pengaturan Situs", href: "/admin/settings", icon: mdiCogOutline, roles: ["super_admin", "admin"] },
    { label: "Log Aktivitas", href: "/admin/activity-logs", icon: mdiAccountEyeOutline, roles: ["super_admin"] },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(currentRole));

  return (
    <div className="min-h-screen w-full bg-surface flex flex-col lg:flex-row overflow-x-hidden">
      
      
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* sidebar main */}
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
              <Image src="/logo.svg" alt="Logo TEMU" width={90} height={90} className="object-contain" />
              <div className="flex flex-col">
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
          className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-600 bg-red-50/50 hover:bg-red-100 hover:text-red-700 rounded-full transition-all duration-200 cursor-pointer group shadow-2xs"
        >
          <div className="p-1 bg-red-100 group-hover:bg-red-200 rounded-full transition-colors">
            <Icon path={mdiLogout} size={0.75} className="text-red-600" />
          </div>
          <span>Keluar Sistem</span>
        </button>
      </aside>

      {/* main konten */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <header className="h-16 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* kiri header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              <Icon path={sidebarOpen ? mdiClose : mdiMenu} size={1.2} />
            </button>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-teal-600 rounded-full">
              {roleConfig.label}
            </span>
          </div>

          {/* kanan header */}
          <button
            onClick={handleOpenDrawer}
            className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{userProfile.name || "Admin"}</p>
              <p className="text-[11px] text-gray-400">{roleConfig.label}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
              {(userProfile.name || "A").charAt(0).toUpperCase()}
            </div>
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* profil dan edit admin */}
      {isProfileOpen && <div onClick={() => setIsProfileOpen(false)} className="fixed inset-0 z-40 bg-black/20" />}

      <aside className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isProfileOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <Icon path={mdiAccountCircle} size={1} className="text-primary" />
            <div>
              <h2 className="text-base font-bold text-gray-800">
                {isEditing ? "Edit Profil" : "Informasi Profil"}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditing ? "Perbarui informasi akun Anda" : "Data diri dan hak akses panel"}
              </p>
            </div>
          </div>
          <button onClick={() => setIsProfileOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
            <Icon path={mdiClose} size={0.8} />
          </button>
        </div>


        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-md">
                  {(userProfile.name || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{userProfile.name}</h3>
                  <p className="text-xs text-gray-500">{userProfile.email}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${roleConfig.badge}`}>
                  <Icon path={mdiShieldCheck} size={0.6} />
                  {roleConfig.label}
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-white border border-gray-100 rounded-xl">
                  <p className="text-[11px] text-gray-400 font-medium">Nama Lengkap</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{userProfile.name}</p>
                </div>
                <div className="p-3.5 bg-white border border-gray-100 rounded-xl">
                  <p className="text-[11px] text-gray-400 font-medium">Alamat Email</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{userProfile.email}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 bg-primary hover:bg-[#2489b5] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Icon path={mdiPencil} size={0.7} />
                Edit Profil Saya
              </button>
            </div>
          ) : (
            <form id="profile-form" onSubmit={handleSubmitProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <Icon path={mdiAccount} size={0.7} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Email</label>
                <div className="relative">
                  <Icon path={mdiEmail} size={0.7} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary text-gray-800"
                  />
                </div>
              </div>

              <hr className="border-gray-100 my-2" />
              <p className="text-xs font-bold text-gray-800">Ubah Kata Sandi (Opsional)</p>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kata Sandi Baru</label>
                <div className="relative">
                  <Icon path={mdiLock} size={0.7} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary text-gray-800"
                    placeholder="Biarkan kosong jika tidak diubah"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <Icon path={mdiLock} size={0.7} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary text-gray-800"
                    placeholder="Ulangi kata sandi baru"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Icon path={mdiArrowLeft} size={0.6} />
              Batal
            </button>
            <button
              type="submit"
              form="profile-form"
              disabled={submitting}
              className="px-4 py-2 bg-primary hover:bg-[#2489b5] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Icon path={submitting ? mdiLoading : mdiContentSave} size={0.6} className={submitting ? "animate-spin" : ""} />
              {submitting ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}