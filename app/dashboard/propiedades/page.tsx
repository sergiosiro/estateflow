"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Property } from "@/types/property";
import {
  getUserProperties,
  createUserProperty,
  updateUserProperty,
  deleteUserProperty,
} from "@/lib/properties";
import PropertyModal from "@/components/dashboard/PropertyModal";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function MyPropertiesPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const { user } = useAuth();
  const { t } = useLanguage();

  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 1245,
    inquiries: 14,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Toast / alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAdminDeniedNotice, setShowAdminDeniedNotice] = useState(false);

  useEffect(() => {
    if (resolvedParams.error === "admin_required") {
      setShowAdminDeniedNotice(true);
    }
  }, [resolvedParams]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await getUserProperties(user?.id);
      setProperties(res.properties);
      setStats(res.stats);
    } catch (err) {
      console.error("Error loading user properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveProperty = async (formData: any) => {
    if (propertyToEdit) {
      const res = await updateUserProperty(propertyToEdit.id, formData);
      if (res.success) {
        showToast(t.dashboard.propertyUpdated);
        await loadProperties();
      } else {
        throw new Error(res.error || "Error al actualizar");
      }
    } else {
      const res = await createUserProperty(formData, user?.id);
      if (res.success) {
        showToast(t.dashboard.propertyCreated);
        await loadProperties();
      } else {
        throw new Error(res.error || "Error al crear");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;
    try {
      const res = await deleteUserProperty(propertyToDelete.id);
      if (res.success) {
        showToast(t.dashboard.propertyDeleted);
        setPropertyToDelete(null);
        await loadProperties();
      } else {
        alert(res.error || "Error al eliminar la propiedad");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.address.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Admin Required Notice */}
      {showAdminDeniedNotice && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start justify-between gap-3 text-amber-800 dark:text-amber-200 text-sm">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
              lock
            </span>
            <div>
              <p className="font-bold">{t.dashboard.accessDeniedTitle}</p>
              <p className="text-xs">{t.dashboard.accessDeniedSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdminDeniedNotice(false)}
            className="text-amber-700 dark:text-amber-300 hover:opacity-75 p-1"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-mosque text-white shadow-2xl flex items-center gap-3 text-sm animate-bounce font-medium">
          <span className="material-symbols-outlined text-emerald-300">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#142421] p-6 rounded-2xl border border-nordic/10 dark:border-emerald-500/20 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-nordic dark:text-white">
            {t.dashboard.myPropertiesTitle}
          </h1>
          <p className="text-sm text-nordic/70 dark:text-emerald-100/70 mt-1">
            {t.dashboard.myPropertiesSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Quick Search */}
          <div className="relative flex-grow sm:flex-grow-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-nordic/40 dark:text-emerald-100/40 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full sm:w-44 pl-9 pr-3 py-2 bg-clear-day/60 dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-xs text-nordic dark:text-white outline-none focus:border-mosque"
            />
          </div>

          <button
            onClick={() => {
              setPropertyToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-mosque dark:bg-emerald-600 text-white hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-colors px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm flex items-center gap-2 shadow-xs whitespace-nowrap active:scale-95 duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>{t.dashboard.addNewProperty}</span>
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 bg-white/50 dark:bg-[#142421]/50 rounded-2xl animate-pulse border border-nordic/10 dark:border-emerald-500/20"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Properties Cards */}
          {filteredProperties.map((property) => {
            const isDraft = property.tag?.toLowerCase() === "draft";
            return (
              <div
                key={property.id}
                className="bg-white dark:bg-[#142421] border border-nordic/10 dark:border-emerald-500/20 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-mosque/30 dark:hover:border-emerald-500/40 transition-all group flex flex-col"
              >
                {/* Photo & Badges */}
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status badge */}
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
                      isDraft
                        ? "bg-slate-200/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200"
                        : "bg-hint-of-green/90 dark:bg-emerald-900/90 text-mosque dark:text-emerald-300"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDraft ? "bg-slate-500" : "bg-mosque dark:bg-emerald-400"
                      }`}
                    />
                    <span>{isDraft ? t.dashboard.draftStatus : t.dashboard.activeStatus}</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#0d1816]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-mosque dark:text-emerald-400 shadow-sm">
                    {property.formattedPrice}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-nordic dark:text-white line-clamp-1 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-xs text-nordic/60 dark:text-emerald-100/60 mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-mosque dark:text-emerald-400">
                      location_on
                    </span>
                    <span className="truncate">{property.address}</span>
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-3 text-xs text-nordic/70 dark:text-emerald-100/70 mb-4">
                    <span>{property.beds} {t.card.beds}</span>
                    <span>•</span>
                    <span>{property.baths} {t.card.baths}</span>
                    <span>•</span>
                    <span>{property.sqft} {t.card.sqft}</span>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-nordic/10 dark:border-emerald-500/20">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setPropertyToEdit(property);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-nordic/60 dark:text-emerald-100/60 hover:text-mosque dark:hover:text-emerald-400 hover:bg-hint-of-green/20 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                        title={t.dashboard.edit}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setPropertyToDelete(property)}
                        className="p-2 text-nordic/60 dark:text-emerald-100/60 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        title={t.dashboard.delete}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <Link
                      href={`/propiedad/${property.slug}`}
                      className="text-mosque dark:text-emerald-400 hover:text-mosque/80 dark:hover:text-emerald-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <span>{isDraft ? t.dashboard.completeDraft : t.dashboard.viewAnalytics}</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {isDraft ? "arrow_forward" : "trending_up"}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bento Analytics Summary Card */}
          <div className="bg-hint-of-green/30 dark:bg-emerald-950/30 border border-mosque/15 dark:border-emerald-500/20 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-nordic dark:text-emerald-100">
                  {t.dashboard.portfolioOverview}
                </h3>
                <span className="material-symbols-outlined text-mosque dark:text-emerald-400">
                  analytics
                </span>
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-mosque dark:text-emerald-400 mb-1">
                {stats.totalProperties || properties.length}
              </div>
              <p className="text-xs text-nordic/60 dark:text-emerald-100/60">
                {t.dashboard.totalProperties}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-mosque/15 dark:border-emerald-500/20 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-nordic/70 dark:text-emerald-100/70">
                  {t.dashboard.totalViews}
                </span>
                <span className="font-bold text-mosque dark:text-emerald-400">
                  {stats.totalViews.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-nordic/70 dark:text-emerald-100/70">
                  {t.dashboard.inquiries}
                </span>
                <span className="font-bold text-mosque dark:text-emerald-400">
                  {stats.inquiries}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProperties.length === 0 && (
        <div className="py-16 text-center bg-white dark:bg-[#142421] rounded-2xl border border-nordic/10 dark:border-emerald-500/20 p-8">
          <span className="material-symbols-outlined text-5xl text-nordic/30 dark:text-emerald-500/30 mb-3">
            real_estate_agent
          </span>
          <h3 className="text-lg font-bold text-nordic dark:text-white mb-1">
            No tienes propiedades publicadas
          </h3>
          <p className="text-xs text-nordic/60 dark:text-emerald-100/60 max-w-sm mx-auto mb-5">
            Publica tu primera propiedad para empezar a recibir consultas y monitorear su rendimiento en tiempo real.
          </p>
          <button
            onClick={() => {
              setPropertyToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-mosque dark:bg-emerald-600 text-white hover:bg-mosque/90 px-5 py-2.5 rounded-xl font-semibold text-xs inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>{t.dashboard.addNewProperty}</span>
          </button>
        </div>
      )}

      {/* Property Modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPropertyToEdit(null);
        }}
        onSave={handleSaveProperty}
        propertyToEdit={propertyToEdit}
      />

      {/* Delete Confirmation Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#142421] rounded-2xl border border-nordic/15 dark:border-emerald-500/30 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-lg font-bold">{t.dashboard.confirmDelete}</h3>
            </div>
            <p className="text-xs text-nordic/70 dark:text-emerald-100/70">
              {t.dashboard.confirmDeletePropertyMsg}
            </p>
            <p className="text-xs font-semibold text-nordic dark:text-white bg-clear-day dark:bg-[#0d1816] p-2.5 rounded-lg truncate">
              {propertyToDelete.title}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/20 cursor-pointer"
              >
                {t.dashboard.cancel}
              </button>
              <button
                onClick={handleDeleteConfirm}
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
