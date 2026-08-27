"use client";

import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import {
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
} from "@mdi/js";
import Swal from "sweetalert2";
import { updateAdminProfile } from "@/app/admin/profile/actions";

interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminHeader({ user }: { user?: UserProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProps>(
    user || { id: "", name: "Admin", email: "-", role: "admin" }
  );

  useEffect(() => {
    if (user) setUserProfile(user);
  }, [user]);

  const [form, setForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
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

  const roleConfig = getRoleConfig(userProfile.role);

  const handleOpenDrawer = () => {
    setForm({
      name: userProfile.name,
      email: userProfile.email,
      newPassword: "",
      confirmPassword: "",
    });
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
      <header className="w-full lg:w-[calc(100%-16rem)] bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-xs fixed top-0 right-0 z-30">
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-teal-600 rounded-full">
          {roleConfig.label}
        </span>

        <button
          onClick={handleOpenDrawer}
          className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{userProfile.name}</p>
            <p className="text-[11px] text-gray-400">{roleConfig.label}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
            {(userProfile.name || "A").charAt(0).toUpperCase()}
          </div>
        </button>
      </header>

      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-black/20" />}

      <aside className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Drawer Header */}
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
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
            <Icon path={mdiClose} size={0.8} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isEditing ? (
            /* MODE BACA / LOOKUP DATA DIRI */
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
            /* MODE EDIT FORM */
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
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

        {/* Drawer Footer */}
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
    </>
  );
}