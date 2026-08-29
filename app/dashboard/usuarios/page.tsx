"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, UserProfile } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  getAllProfiles,
  adminCreateUser,
  adminUpdateRole,
  adminUpdateStatus,
  adminDeleteUser,
} from "@/lib/users";
import UserModal from "@/components/dashboard/UserModal";

export default function UserManagementPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Actions
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<UserProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllProfiles();
      if (res.data) {
        setProfiles(res.data);
      }
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateUser = async (userData: {
    email: string;
    password: string;
    fullName: string;
    role: "admin" | "user";
  }) => {
    const res = await adminCreateUser(userData);
    if (res.success) {
      showToast(t.dashboard.userCreated);
      await loadUsers();
    } else {
      throw new Error(res.error || "Error al crear usuario");
    }
  };

  const handleToggleRole = async (targetUser: UserProfile) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    const res = await adminUpdateRole(targetUser.id, newRole);
    if (res.success) {
      showToast(
        `Rol de ${targetUser.full_name || targetUser.email} actualizado a ${
          newRole === "admin" ? "Administrador" : "Usuario Común"
        }.`
      );
      setUserToChangeRole(null);
      await loadUsers();
    } else {
      alert(res.error || "Error al actualizar rol");
    }
  };

  const handleToggleStatus = async (targetUser: UserProfile) => {
    const newStatus = targetUser.status === "active" ? "suspended" : "active";
    const res = await adminUpdateStatus(targetUser.id, newStatus);
    if (res.success) {
      showToast(
        `Usuario ${targetUser.full_name || targetUser.email} marcado como ${
          newStatus === "active" ? "Activo" : "Suspendido"
        }.`
      );
      await loadUsers();
    } else {
      alert(res.error || "Error al actualizar estado");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    const res = await adminDeleteUser(userToDelete.id);
    if (res.success) {
      showToast(t.dashboard.userDeleted);
      setUserToDelete(null);
      await loadUsers();
    } else {
      alert(res.error || "Error al eliminar usuario");
    }
  };

  // Filter users by search term
  const filteredUsers = profiles.filter((p) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    return (
      (p.full_name || "").toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.role.toLowerCase().includes(term)
    );
  });

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return (email?.slice(0, 2) || "US").toUpperCase();
  };

  // If loading auth state
  if (authLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 rounded-full border-4 border-mosque/30 border-t-mosque animate-spin" />
      </div>
    );
  }

  // If user is not an admin, display access denied
  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-[#142421] p-12 rounded-2xl border border-nordic/10 dark:border-emerald-500/20 shadow-xs text-center space-y-4 max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-nordic dark:text-white">
          {t.dashboard.accessDeniedTitle}
        </h2>
        <p className="text-sm text-nordic/70 dark:text-emerald-100/70">
          {t.dashboard.accessDeniedSubtitle}
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/propiedades"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-mosque dark:bg-emerald-600 hover:bg-mosque/90 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>{t.dashboard.returnToProperties}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-mosque text-white shadow-2xl flex items-center gap-3 text-sm animate-bounce font-medium">
          <span className="material-symbols-outlined text-emerald-300">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Search / Add Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#142421] p-6 rounded-2xl border border-nordic/10 dark:border-emerald-500/20 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-nordic dark:text-white">
            {t.dashboard.userManagementTitle}
          </h1>
          <p className="text-sm text-nordic/70 dark:text-emerald-100/70 mt-1">
            {t.dashboard.userManagementSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-grow sm:flex-grow-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-nordic/40 dark:text-emerald-100/40 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.dashboard.searchUsers}
              className="w-full sm:w-56 pl-9 pr-3 py-2 bg-clear-day/60 dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-xs text-nordic dark:text-white outline-none focus:border-mosque"
            />
          </div>

          {/* Add User Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-mosque dark:bg-emerald-600 text-white hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-colors px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm flex items-center gap-2 shadow-xs whitespace-nowrap active:scale-95 duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>{t.dashboard.addUser}</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-clear-day/50 dark:bg-emerald-950/20 border-b border-nordic/10 dark:border-emerald-500/20">
              <th className="px-6 py-4 text-xs uppercase font-bold tracking-wider text-nordic/70 dark:text-emerald-100/70">
                {t.dashboard.userColumn}
              </th>
              <th className="px-6 py-4 text-xs uppercase font-bold tracking-wider text-nordic/70 dark:text-emerald-100/70">
                {t.dashboard.roleColumn}
              </th>
              <th className="px-6 py-4 text-xs uppercase font-bold tracking-wider text-nordic/70 dark:text-emerald-100/70">
                {t.dashboard.statusColumn}
              </th>
              <th className="px-6 py-4 text-xs uppercase font-bold tracking-wider text-nordic/70 dark:text-emerald-100/70 text-right">
                {t.dashboard.actionsColumn}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-nordic/5 dark:divide-emerald-500/10 text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-nordic/50">
                  <div className="w-8 h-8 rounded-full border-2 border-mosque/30 border-t-mosque animate-spin mx-auto mb-2" />
                  <span>Cargando usuarios del sistema...</span>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-nordic/50">
                  No se encontraron usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isCurrentUser = user?.id === u.id;
                const isAdminRole = u.role === "admin";
                const isSuspended = u.status === "suspended";

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-hint-of-green/10 dark:hover:bg-emerald-950/20 transition-colors group"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            isAdminRole
                              ? "bg-mosque dark:bg-emerald-600 text-white shadow-xs"
                              : "bg-hint-of-green dark:bg-emerald-950 text-mosque dark:text-emerald-300 border border-mosque/20"
                          }`}
                        >
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.full_name || u.email}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span>{getInitials(u.full_name, u.email)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-nordic dark:text-white flex items-center gap-2">
                            <span>{u.full_name || u.email.split("@")[0]}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] bg-hint-of-green dark:bg-emerald-900/60 text-mosque dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                Tú
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-nordic/60 dark:text-emerald-100/60">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
                          isAdminRole
                            ? "bg-mosque/15 dark:bg-emerald-900/50 text-mosque dark:text-emerald-300 border border-mosque/30"
                            : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isAdminRole ? "admin_panel_settings" : "person"}
                        </span>
                        <span>{isAdminRole ? t.dashboard.adminRole : t.dashboard.userRole}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          isSuspended
                            ? "text-red-600 dark:text-red-400"
                            : "text-mosque dark:text-emerald-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSuspended ? "bg-red-500" : "bg-mosque dark:bg-emerald-400"
                          }`}
                        />
                        <span>{isSuspended ? t.dashboard.suspendedUser : t.dashboard.activeUser}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        {/* Edit Role Button */}
                        <button
                          onClick={() => setUserToChangeRole(u)}
                          disabled={isCurrentUser}
                          className="p-1.5 text-nordic/60 dark:text-emerald-100/60 hover:text-mosque dark:hover:text-emerald-400 hover:bg-hint-of-green/20 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title={t.dashboard.editPermissions}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            admin_panel_settings
                          </span>
                        </button>

                        {/* Suspend / Restore Toggle */}
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isCurrentUser}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                            isSuspended
                              ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          }`}
                          title={isSuspended ? t.dashboard.restore : t.dashboard.suspend}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isSuspended ? "restore" : "block"}
                          </span>
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => setUserToDelete(u)}
                          disabled={isCurrentUser}
                          className="p-1.5 text-nordic/60 dark:text-emerald-100/60 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title={t.dashboard.deleteUser}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <UserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateUser}
      />

      {/* Change Role Modal */}
      {userToChangeRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#142421] rounded-2xl border border-nordic/15 dark:border-emerald-500/30 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-mosque dark:text-emerald-400">
              <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
              <h3 className="text-lg font-bold">Cambiar Rol de Usuario</h3>
            </div>
            <p className="text-xs text-nordic/70 dark:text-emerald-100/70">
              ¿Deseas cambiar el rol de{" "}
              <strong className="text-nordic dark:text-white">
                {userToChangeRole.full_name || userToChangeRole.email}
              </strong>{" "}
              a{" "}
              <strong className="text-mosque dark:text-emerald-400">
                {userToChangeRole.role === "admin" ? "Usuario Común" : "Administrador"}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUserToChangeRole(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/20 cursor-pointer"
              >
                {t.dashboard.cancel}
              </button>
              <button
                onClick={() => handleToggleRole(userToChangeRole)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-mosque dark:bg-emerald-600 hover:bg-mosque/90 text-white cursor-pointer shadow-sm"
              >
                Confirmar Cambio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#142421] rounded-2xl border border-nordic/15 dark:border-emerald-500/30 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-lg font-bold">{t.dashboard.confirmDelete}</h3>
            </div>
            <p className="text-xs text-nordic/70 dark:text-emerald-100/70">
              {t.dashboard.confirmDeleteUserMsg}
            </p>
            <p className="text-xs font-semibold text-nordic dark:text-white bg-clear-day dark:bg-[#0d1816] p-2.5 rounded-lg truncate">
              {userToDelete.full_name || userToDelete.email} ({userToDelete.email})
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/20 cursor-pointer"
              >
                {t.dashboard.cancel}
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm"
              >
                {t.dashboard.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
