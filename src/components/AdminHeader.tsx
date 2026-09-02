"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@mdi/react";
import {
  mdiMenu,
  mdiAccountCircle,
  mdiClose,
  mdiContentSave,
  mdiLoading,
  mdiLock,
  mdiEmail,
  mdiAccount,
  mdiShieldCheck,
  mdiPencil,
  mdiArrowLeft,
  mdiEye,
  mdiEyeOff,
  mdiKeyVariant,
  mdiInformationOutline,
  mdiKeyOutline, 
  mdiTrashCanOutline,
  mdiLogout
} from "@mdi/js";
import Swal from "sweetalert2";
import { updateAdminProfile } from "@/app/admin/profile/actions";

interface UserProps {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}


interface AdminHeaderProps {
  user?: UserProps;
  onMenuClick?: () => void;
}

export default function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProps>(
    user || { id: "", name: "Admin", email: "-", role: "admin" }
  );


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

  useEffect(() => {
    if (user) setUserProfile(user);
  }, [user]);

  const [form, setForm] = useState<{
    name: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    name: userProfile.name ?? "",
    email: userProfile.email ?? "",
    newPassword: "",
    confirmPassword: "",
  });

  const getRoleConfig = (roleStr?: string) => {
    const norm = (roleStr ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (norm.includes("super")) {
      return {
        label: "Super Admin",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      };
    }
    if (norm.includes("kontributor")) {
      return {
        label: "Kontributor Berita",
        badge: "bg-teal-50 text-teal-700 border-teal-200/60",
      };
    }
    return {
      label: "Administrator",
      badge: "bg-sky-50 text-sky-700 border-sky-200/60",
    };
  };

  const roleConfig = getRoleConfig(userProfile.role);

  const handleOpenDrawer = () => {
    setForm({
      name: userProfile.name ?? "",
      email: userProfile.email ?? "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsEditing(false);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

return (
  <>
    <header className="w-full lg:w-[calc(100%-16rem)] bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs fixed top-0 right-0 z-30">
      {/* hamburger button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Buka Menu"
        >
          <Icon path={mdiMenu} size={1} />
        </button>

        <span className="text-xs font-semibold px-3 py-1 bg-teal-50 text-primary rounded-full border border-teal-100">
          {roleConfig.label}
        </span>
      </div>

      {/* Kanan Profile Button */}
      <button
        onClick={handleOpenDrawer}
        className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-800">{userProfile.name}</p>
          <p className="text-[11px] text-slate-400">{roleConfig.label}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
          {(userProfile.name || "A").charAt(0).toUpperCase()}
        </div>
      </button>
    </header>

    {isOpen && (
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-40 bg-slate-600/20 transition-opacity duration-300"
      />
    )}

    <aside
      className={`fixed top-0 right-0 h-full w-[82%] sm:w-95 md:w-100 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* tutup */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
        <button
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <Icon path={mdiClose} size={0.7} />
          <span>Tutup</span>
        </button>

        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {isEditing ? "Edit Profil" : "Profil Admin"}
        </span>
      </div>

      {/* content body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {!isEditing ? (

          
          /* MODE TAMPILAN PROFIL */
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center border-2 border-primary p-1 shadow-xs">
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    <Icon path={mdiAccount} size={2.5} className="text-slate-400 mt-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wide">
                  {userProfile.name}
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  {userProfile.email}
                </p>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 my-2" />

            <div className="space-y-3">
              <div className="p-3.5 bg-white border border-slate-100 shadow-xs rounded-2xl flex flex-col gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Status Akun</span>
                <div className="flex">
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 rounded-md border border-emerald-100">
                    Aktif
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white border border-slate-100 shadow-xs rounded-2xl flex flex-col gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Hak Akses / Peran</span>
                <div className="flex">
                  <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md border ${roleConfig.badge}`}>
                    {roleConfig.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 my-2" />

            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 tracking-wider">
                Pengaturan
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full p-3.5 bg-white border border-slate-200 hover:border-primary rounded-xl flex items-center gap-3 transition-all text-slate-700 hover:text-primary group cursor-pointer shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon path={mdiShieldCheck} size={0.7} />
                </div>
                <span className="text-xs font-semibold flex-1 text-left">Edit Profil & Sandi</span>
              </button>
            </div>

            <div className="border-t border-dashed border-slate-200 my-2" />

              {/* Tombol Keluar Akun */}
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Keluar Akun?",
                    text: "Apakah Anda yakin ingin keluar dari sistem?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ef4444",
                    cancelButtonColor: "#6b7280",
                    confirmButtonText: "Ya, Keluar!",
                    cancelButtonText: "Batal"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleLogout();
                    }
                  });
                }}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Icon path={mdiLogout} size={0.7} />
                <span>Keluar Akun</span>
              </button>
            </div>
        ) : (


          /* MODE EDIT FORM */
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <Icon path={mdiArrowLeft} size={0.8} />
              </button>
              <h3 className="font-bold text-slate-800 text-sm">Kembali ke Profil</h3>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-start gap-2.5 text-slate-600 text-[11px]">
              <Icon path={mdiInformationOutline} size={0.8} className="text-primary shrink-0 mt-0.5" />
              <span>Perbarui nama, alamat email, atau kata sandi login admin Anda di bawah ini.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <Icon
                  path={mdiAccount}
                  size={0.75}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary text-slate-800 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Icon
                  path={mdiEmail}
                  size={0.75}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary text-slate-800 transition-colors"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 my-3" />
            <div className="flex items-center gap-1.5">
              <Icon path={mdiKeyVariant} size={0.65} className="text-primary" />
              <p className="text-xs font-semibold text-slate-600">Ubah Kata Sandi (Opsional)</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Icon
                  path={mdiLock}
                  size={0.75}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                  className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary text-slate-800 transition-colors"
                  placeholder="Biarkan kosong jika tidak diubah"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <Icon path={showNewPassword ? mdiEyeOff : mdiEye} size={0.75} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Icon
                  path={mdiLock}
                  size={0.75}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary text-slate-800 transition-colors"
                  placeholder="Ulangi kata sandi baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <Icon path={showConfirmPassword ? mdiEyeOff : mdiEye} size={0.75} />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Drawer Footer Mode Edit */}
      {isEditing && (
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Icon path={mdiArrowLeft} size={0.6} />
            Batal
          </button>
          <button
            type="submit"
            form="profile-form"
            disabled={submitting}
            className="px-4 py-2.5 bg-primary hover:bg-[#28726e] text-white text-xs font-medium rounded-full flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
          >
            <Icon
              path={submitting ? mdiLoading : mdiContentSave}
              size={0.6}
              className={submitting ? "animate-spin" : ""}
            />
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      )}
    </aside>
  </>
);
}