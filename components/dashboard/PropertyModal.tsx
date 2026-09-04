"use client";

import { useState, useEffect, useRef } from "react";
import { Property } from "@/types/property";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { uploadPropertyImage } from "@/lib/supabase/storage";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  propertyToEdit?: Property | null;
}

interface SelectedLocalFile {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  sizeFormatted: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PropertyModal({
  isOpen,
  onClose,
  onSave,
  propertyToEdit,
}: PropertyModalProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [beds, setBeds] = useState<number>(3);
  const [baths, setBaths] = useState<number>(2);
  const [sqft, setSqft] = useState<number>(1800);
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [description, setDescription] = useState("");

  // Images state
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<SelectedLocalFile[]>([]);
  const [primaryKey, setPrimaryKey] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Submission & Progress
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cleanup helper for object URLs
  const cleanupObjectUrls = (files: SelectedLocalFile[]) => {
    files.forEach((f) => {
      try {
        URL.revokeObjectURL(f.previewUrl);
      } catch (e) {
        console.error("Error revoking object URL:", e);
      }
    });
  };

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
      setDescription(propertyToEdit.description || "");

      const imgs = propertyToEdit.images && propertyToEdit.images.length > 0
        ? propertyToEdit.images
        : (propertyToEdit.imageUrl ? [propertyToEdit.imageUrl] : []);

      setExistingImages(imgs);
      setPrimaryKey(propertyToEdit.imageUrl || imgs[0] || "");
      setSelectedFiles([]);
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
      setDescription("");
      setExistingImages([]);
      setSelectedFiles([]);
      setPrimaryKey("");
    }
    setErrorMsg(null);
    setUploadStatusText(null);
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local files selected
  const handleFilesAdded = (files: FileList | File[]) => {
    setErrorMsg(null);
    const validFiles: SelectedLocalFile[] = [];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setErrorMsg(`"${file.name}" no es una imagen válida.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setErrorMsg(`"${file.name}" supera el límite de 10 MB.`);
        return;
      }

      const id = `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const previewUrl = URL.createObjectURL(file);
      validFiles.push({
        id,
        file,
        previewUrl,
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
      });
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => {
        const next = [...prev, ...validFiles];
        // If no primary key set yet, set the first newly added image as primary
        if (!primaryKey) {
          setPrimaryKey(validFiles[0].id);
        }
        return next;
      });
    }
  };

  // Remove existing image
  const handleRemoveExistingImage = (urlToRemove: string) => {
    setExistingImages((prev) => {
      const next = prev.filter((url) => url !== urlToRemove);
      if (primaryKey === urlToRemove) {
        setPrimaryKey(next[0] || (selectedFiles[0] ? selectedFiles[0].id : ""));
      }
      return next;
    });
  };

  // Remove newly selected local file
  const handleRemoveSelectedFile = (fileId: string) => {
    setSelectedFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target) {
        try {
          URL.revokeObjectURL(target.previewUrl);
        } catch (e) {
          console.error(e);
        }
      }
      const next = prev.filter((f) => f.id !== fileId);
      if (primaryKey === fileId) {
        setPrimaryKey(existingImages[0] || (next[0] ? next[0].id : ""));
      }
      return next;
    });
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleClose = () => {
    cleanupObjectUrls(selectedFiles);
    onClose();
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !location.trim()) {
      setErrorMsg("Por favor completa los campos requeridos (*).");
      return;
    }

    const totalImagesCount = existingImages.length + selectedFiles.length;
    if (totalImagesCount === 0) {
      setErrorMsg("Debes incorporar al menos una imagen para la propiedad.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const uploadedUrlsMap = new Map<string, string>(); // file.id -> publicUrl
      const newUploadedUrls: string[] = [];

      // Upload selected local files to Supabase Storage
      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const item = selectedFiles[i];
          setUploadStatusText(
            `${t.dashboard.uploadingImages} (${i + 1}/${selectedFiles.length})`
          );

          const result = await uploadPropertyImage(item.file, "properties");
          if (result.error || !result.url) {
            throw new Error(
              `Error al subir "${item.name}" a Supabase: ${result.error || "Desconocido"}`
            );
          }

          uploadedUrlsMap.set(item.id, result.url);
          newUploadedUrls.push(result.url);
        }
      }

      setUploadStatusText("Guardando detalles de la propiedad...");

      // Build complete final images array
      const allImages = [...existingImages, ...newUploadedUrls];

      // Determine main primary image URL
      let mainImageUrl = "";
      if (existingImages.includes(primaryKey)) {
        mainImageUrl = primaryKey;
      } else if (uploadedUrlsMap.has(primaryKey)) {
        mainImageUrl = uploadedUrlsMap.get(primaryKey)!;
      } else {
        mainImageUrl = allImages[0] || "";
      }

      // Reorder allImages to ensure primary is first
      const orderedImages = [
        mainImageUrl,
        ...allImages.filter((img) => img !== mainImageUrl),
      ];

      await onSave({
        title: title.trim(),
        price: Number(price),
        location: location.trim(),
        city: city.trim() || "Metropolitan Area",
        state: state.trim() || "FL",
        beds: Number(beds),
        baths: Number(baths),
        sqft: Number(sqft),
        status,
        imageUrl: mainImageUrl,
        images: orderedImages,
        description: description.trim(),
        tag: status === "draft" ? "Draft" : "Active",
      });

      cleanupObjectUrls(selectedFiles);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj?.message || "Error al procesar la propiedad.");
    } finally {
      setIsSubmitting(false);
      setUploadStatusText(null);
    }
  };

  const totalImagesCount = existingImages.length + selectedFiles.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#142421] rounded-2xl border border-nordic/15 dark:border-emerald-500/30 max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-nordic/10 dark:border-emerald-500/20 bg-clear-day/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-mosque dark:text-emerald-400 text-2xl">
              {propertyToEdit ? "edit_note" : "add_home"}
            </span>
            <h3 className="text-lg font-bold text-nordic dark:text-white">
              {propertyToEdit ? "Editar Propiedad" : t.dashboard.addNewProperty}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-nordic/50 dark:text-emerald-100/50 hover:text-nordic dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-base flex-shrink-0 text-red-500">
                error
              </span>
              <span className="leading-tight">{errorMsg}</span>
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
              placeholder="Ej: Villa Moderna con Vista Panorámica"
              required
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 transition-colors"
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
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-nordic dark:text-emerald-100 mb-1">
                Estado de Publicación
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
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 transition-colors"
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
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 transition-colors"
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
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 transition-colors"
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
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 transition-colors"
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
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          {/* REAL IMAGE UPLOADER (SUPABASE STORAGE) */}
          <div className="pt-2">
            <div className="flex justify-between items-baseline mb-2">
              <div>
                <label className="block text-xs font-bold text-nordic dark:text-emerald-100">
                  {t.dashboard.uploadImagesTitle} *
                </label>
                <p className="text-[11px] text-nordic/60 dark:text-emerald-100/60">
                  {t.dashboard.uploadImagesSubtitle}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-mosque dark:text-emerald-400">
                {totalImagesCount} {totalImagesCount === 1 ? "imagen" : "imágenes"}
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFilesAdded(e.target.files);
                  e.target.value = "";
                }
              }}
              className="hidden"
            />

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${
                isDragging
                  ? "border-mosque bg-hint-of-green/20 dark:bg-emerald-950/40 scale-[1.01]"
                  : "border-nordic/20 dark:border-emerald-500/30 bg-clear-day/40 dark:bg-[#0d1816]/60 hover:border-mosque/60 hover:bg-hint-of-green/10"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-hint-of-green/50 dark:bg-emerald-900/40 text-mosque dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">
                  cloud_upload
                </span>
              </div>
              <div className="text-xs text-nordic dark:text-emerald-100 font-medium">
                <span>{t.dashboard.dragDropText} </span>
                <span className="text-mosque dark:text-emerald-400 font-bold underline underline-offset-2">
                  {t.dashboard.browseFiles}
                </span>
              </div>
              <p className="text-[10px] text-nordic/50 dark:text-emerald-100/50">
                PNG, JPG, WEBP, GIF o AVIF (hasta 10 MB c/u)
              </p>
            </div>

            {/* Previews Grid */}
            {totalImagesCount > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {/* 1. Existing Images */}
                {existingImages.map((imgUrl, index) => {
                  const isPrimary = primaryKey === imgUrl || (!primaryKey && index === 0);
                  return (
                    <div
                      key={`existing-${index}`}
                      className={`relative group rounded-xl overflow-hidden aspect-4/3 border-2 transition-all shadow-xs ${
                        isPrimary
                          ? "border-mosque dark:border-emerald-400 ring-2 ring-mosque/30"
                          : "border-nordic/15 dark:border-emerald-500/20"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Existente ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Primary Badge */}
                      {isPrimary && (
                        <div className="absolute top-1.5 left-1.5 bg-mosque text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">star</span>
                          <span>{t.dashboard.primaryImageBadge}</span>
                        </div>
                      )}

                      {/* Hover Overlay with Controls */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveExistingImage(imgUrl);
                            }}
                            className="p-1 rounded-md bg-red-600/90 text-white hover:bg-red-600 transition-colors"
                            title={t.dashboard.removeImage}
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryKey(imgUrl);
                            }}
                            className="w-full py-1 text-[10px] font-semibold bg-white/90 text-nordic hover:bg-white rounded-md transition-colors"
                          >
                            {t.dashboard.setAsPrimary}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* 2. Newly Selected Local Files */}
                {selectedFiles.map((localItem) => {
                  const isPrimary = primaryKey === localItem.id;
                  return (
                    <div
                      key={localItem.id}
                      className={`relative group rounded-xl overflow-hidden aspect-4/3 border-2 transition-all shadow-xs ${
                        isPrimary
                          ? "border-mosque dark:border-emerald-400 ring-2 ring-mosque/30"
                          : "border-nordic/15 dark:border-emerald-500/20"
                      }`}
                    >
                      <img
                        src={localItem.previewUrl}
                        alt={localItem.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Primary Badge */}
                      {isPrimary && (
                        <div className="absolute top-1.5 left-1.5 bg-mosque text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">star</span>
                          <span>{t.dashboard.primaryImageBadge}</span>
                        </div>
                      )}

                      {/* File size badge */}
                      <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[8px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                        {localItem.sizeFormatted}
                      </div>

                      {/* Hover Overlay with Controls */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSelectedFile(localItem.id);
                            }}
                            className="p-1 rounded-md bg-red-600/90 text-white hover:bg-red-600 transition-colors"
                            title={t.dashboard.removeImage}
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryKey(localItem.id);
                            }}
                            className="w-full py-1 text-[10px] font-semibold bg-white/90 text-nordic hover:bg-white rounded-md transition-colors"
                          >
                            {t.dashboard.setAsPrimary}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0d1816] border border-nordic/15 dark:border-emerald-500/30 rounded-xl text-sm text-nordic dark:text-white outline-none focus:border-mosque dark:focus:border-emerald-400 resize-none transition-colors"
            />
          </div>

          {/* Actions Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-nordic/10 dark:border-emerald-500/20">
            {/* Progress Status Indicator */}
            <div className="text-xs text-nordic/70 dark:text-emerald-100/70 flex items-center gap-2">
              {isSubmitting && uploadStatusText && (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-mosque border-t-transparent animate-spin" />
                  <span className="text-mosque dark:text-emerald-400 font-semibold text-xs">
                    {uploadStatusText}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-nordic/70 dark:text-emerald-100/70 hover:bg-hint-of-green/20 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer disabled:opacity-50"
              >
                {t.dashboard.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-mosque dark:bg-emerald-600 text-white hover:bg-mosque/90 dark:hover:bg-emerald-500 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-base">check</span>
                )}
                <span>{propertyToEdit ? t.dashboard.saveChanges : "Publicar Propiedad"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
