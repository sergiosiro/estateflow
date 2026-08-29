"use client";

import { useState, useEffect } from "react";
import { Property } from "@/types/property";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  propertyToEdit?: Property | null;
}

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
];

export default function PropertyModal({
  isOpen,
  onClose,
  onSave,
  propertyToEdit,
}: PropertyModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [beds, setBeds] = useState<number>(3);
  const [baths, setBaths] = useState<number>(2);
  const [sqft, setSqft] = useState<number>(1800);
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title || "");
      setPrice(propertyToEdit.price || "");
      setLocation(propertyToEdit.address || "");
      setCity(propertyToEdit.city || "");
      setState(propertyToEdit.state || "");
      setBeds(propertyToEdit.beds || 1);
      setBaths(Number(propertyToEdit.baths) || 1);
      setSqft(propertyToEdit.sqft || 500);
      setStatus(propertyToEdit.tag?.toLowerCase() === "draft" ? "draft" : "active");
      setImageUrl(propertyToEdit.imageUrl || PRESET_IMAGES[0]);
      setDescription(propertyToEdit.description || "");
    } else {
      setTitle("");
      setPrice("");
      setLocation("");
      setCity("");
      setState("");
      setBeds(3);
      setBaths(2);
      setSqft(1800);
      setStatus("active");
      setImageUrl(PRESET_IMAGES[0]);
      setDescription("");
    }
    setErrorMsg(null);
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !location) {
      setErrorMsg("Por favor completa los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSave({
        title,
        price: Number(price),
        location,
        city: city || "Metropolitan Area",
        state: state || "FL",
        beds: Number(beds),
        baths: Number(baths),
        sqft: Number(sqft),
        status,
        imageUrl,
        description,
        tag: status === "draft" ? "Draft" : "Active",
      });
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj?.message || "Error al guardar la propiedad.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#142421] rounded-2xl border border-nordic/15 dark:border-emerald-500/30 max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-nordic/10 dark:border-emerald-500/20 bg-clear-day/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-mosque dark:text-emerald-400">
              {propertyToEdit ? "edit" : "add_home"}
            </span>
            <h3 className="text-lg font-bold text-nordic dark:text-white">
              {propertyToEdit ? "Editar Propiedad" : t.dashboard.addNewProperty}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-nordic/50 dark:text-emerald-100/50 hover:text-nordic dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
              Título de la Propiedad *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Luxury Apartment overlooking Downtown"
              required
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
            />
          </div>

          {/* Price & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
                Precio ($ USD) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Ej: 850000"
                required
                min={1}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "draft")}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 cursor-pointer"
              >
                <option value="active">Activa (Publicada)</option>
                <option value="draft">Borrador (Draft)</option>
              </select>
            </div>
          </div>

          {/* Location & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
                Dirección / Ubicación *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: 123 Emerald Ave, Apt 4B"
                required
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
                Ciudad / Zona
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Miami"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Specs: Beds, Baths, Sqft */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
                Habitaciones
              </label>
              <input
                type="number"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                min={1}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
                Baños
              </label>
              <input
                type="number"
                value={baths}
                onChange={(e) => setBaths(Number(e.target.value))}
                min={1}
                step={0.5}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
                Superficie (sqft)
              </label>
              <input
                type="number"
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                min={100}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Image Presets & Custom URL */}
          <div>
            <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-2">
              Imagen Principal de la Propiedad
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(img)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    imageUrl === img
                      ? "border-mosque dark:border-emerald-400 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-xs text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe las características principales de esta propiedad..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 resize-none"
            />
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-nordic/10 dark:border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/20 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              {t.dashboard.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-mosque dark:bg-emerald-600 text-white hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-base">check</span>
              )}
              <span>{t.dashboard.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
