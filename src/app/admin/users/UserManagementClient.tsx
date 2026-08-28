"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { 
  mdiAccountPlus, 
  mdiAccountKey, 
  mdiPencil, 
  mdiTrashCanOutline, 
  mdiShieldAccount,
  mdiEyeOutline,
  mdiEyeOffOutline,
  mdiMagnify,
  mdiEmailOutline,
  mdiClose
} from "@mdi/js";
import Swal from "sweetalert2";
import { createUser, updateUserDetail, updateUserPassword, deleteUser } from "./actions";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | null;
};

export default function UserManagementClient({ initialUsers }: { initialUsers: UserItem[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [modalType, setModalType] = useState<"edit" | "password" | "delete" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("Admin");
  const [newPassword, setNewPassword] = useState("");
  
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // role
  const getRolePriority = (roleStr: string) => {
    const clean = (roleStr || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.includes("super")) return 1;
    if (clean.includes("admin")) return 2;
    return 3;
  };

  const sortedUsers = [...initialUsers].sort(
    (a, b) => getRolePriority(a.role) - getRolePriority(b.role)
  );

  
  const filteredUsers = sortedUsers.filter((user) => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // add user
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    if (password.length < 6) {
      Swal.fire("Peringatan", "Password minimal 6 karakter!", "warning");
      return;
    }

    const res = await createUser(formData);
    if (res && !res.success) {
      Swal.fire("Gagal", res.error, "error");
    } else {
      Swal.fire({
        title: "Berhasil!",
        text: "User baru berhasil ditambahkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsAddOpen(false);
    }
  };

  // edit user
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const res = await updateUserDetail(selectedUser.id, editName, editEmail, editRole);
    if (res && !res.success) {
      Swal.fire("Gagal", res.error, "error");
    } else {
      Swal.fire({
        title: "Berhasil!",
        text: "Data admin berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setModalType(null);
    }
  };

  // ganti password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;

    if (newPassword.length < 6) {
      Swal.fire("Peringatan", "Password baru minimal 6 karakter!", "warning");
      return;
    }

    const res = await updateUserPassword(selectedUser.id, newPassword);
    if (res && !res.success) {
      Swal.fire("Gagal", res.error, "error");
    } else {
      Swal.fire({
        title: "Berhasil!",
        text: "Password berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setNewPassword("");
      setModalType(null);
    }
  };

  // delete
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    const res = await deleteUser(selectedUser.id);
    if (res && !res.success) {
      Swal.fire("Gagal", res.error, "error");
    } else {
      Swal.fire({
        title: "Terhapus!",
        text: "Akun admin berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setModalType(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const lower = role.toLowerCase();
    if (lower.includes("super")) return "bg-sky-50 text-sky-700 border border-sky-200/60";
    if (lower.includes("kontributor")) return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
    return "bg-purple-50 text-purple-700 border border-purple-200/60";
  };

  return (
    <div className="space-y-6 pb-12">
  
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Manajemen Pengguna</h1>
        <p className="text-sm text-gray-500">Kelola hak akses dan akun administrator panel.</p>
      </div>
      <button
        onClick={() => setIsAddOpen(true)}
        className="bg-primary hover:bg-[#2489b5] text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm text-center sm:w-auto w-full"
      >
        <Icon path={mdiAccountPlus} size={0.8} />
        Tambah Admin
      </button>
    </div>

      {/* search */}
      <div className="relative w-full sm:w-80 md:w-96 group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-200 pointer-events-none flex items-center">
          <Icon path={mdiMagnify} size={0.85} />
        </div>

        <input
          type="text"
          placeholder="Cari nama, email, atau role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200/80 rounded-full text-xs sm:text-sm font-reguler text-slate-800 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all shadow-xs"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
            title="Bersihkan pencarian"
          >
            <Icon path={mdiClose} size={0.55} />
          </button>
        )}
      </div>

      {/* card user */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">Tidak ada pengguna yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => {
            const isSuperAdmin = user.role.toLowerCase().includes("super");

            return (
              <div 
                key={user.id} 
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
              
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-base shrink-0 shadow-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">{user.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${getRoleBadge(user.role)}`}>
                          <Icon path={mdiShieldAccount} size={0.55} />
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Icon path={mdiEmailOutline} size={0.65} className="text-slate-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>


                <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setEditName(user.name);
                      setEditEmail(user.email);
                      setEditRole(user.role);
                      setModalType("edit");
                    }}
                    className="flex-1 py-2 text-[14px] font-medium text-slate-600 hover:text-primary bg-slate-50 hover:bg-primary/10 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Edit Admin"
                  >
                    <Icon path={mdiPencil} size={0.65} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setModalType("password");
                    }}
                    className="flex-1 py-2 text-[14px] font-medium text-slate-600 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Ganti Password"
                  >
                    <Icon path={mdiAccountKey} size={0.65} />
                    Sandi
                  </button>

                  {!isSuperAdmin && (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setModalType("delete");
                      }}
                      className="w-9 h-9 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0"
                      title="Hapus Akses"
                    >
                      <Icon path={mdiTrashCanOutline} size={0.7} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tambah Admin */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-xl border border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Tambah Pengguna Baru</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Tambahkan akun administrator atau kontributor panel.</p>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input 
                  name="name" 
                  required 
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Password (Min. 6 Karakter)</label>
                <div className="relative">
                  <input 
                    name="password" 
                    type={showAddPassword ? "text" : "password"} 
                    minLength={6}
                    required 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Icon path={showAddPassword ? mdiEyeOffOutline : mdiEyeOutline} size={0.75} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Role / Hak Akses</label>
                <select 
                  name="role" 
                  defaultValue="Admin" 
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Kontributor Berita">Kontributor Berita</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)} 
                  className="px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-xs font-extrabold bg-primary hover:bg-[#2d7e79] text-white rounded-2xl shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  Simpan Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Data Admin */}
      {modalType === "edit" && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-xl border border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Edit Data Admin</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Perbarui informasi profil pengguna panel.</p>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required 
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Email</label>
                <input 
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required 
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Role / Hak Akses</label>
                <select 
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Kontributor Berita">Kontributor Berita</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setModalType(null)} 
                  className="px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-xs font-extrabold bg-primary hover:bg-[#2d7e79] text-white rounded-2xl shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ganti Password */}
      {modalType === "password" && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-5 shadow-xl border border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Ganti Password</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Masukkan sandi baru untuk akun <strong>{selectedUser.name}</strong></p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showEditPassword ? "text" : "password"}
                  placeholder="Password baru (Min. 6 Karakter)"
                  value={newPassword}
                  minLength={6}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 text-sm bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Icon path={showEditPassword ? mdiEyeOffOutline : mdiEyeOutline} size={0.75} />
                </button>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setModalType(null)} 
                  className="px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-xs font-extrabold bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                >
                  Simpan Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {modalType === "delete" && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-5 shadow-xl border border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Hapus Akses Admin</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Apakah Anda yakin ingin menghapus akun <strong>{selectedUser.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setModalType(null)} 
                className="px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleDeleteSubmit} 
                className="px-5 py-2.5 text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}