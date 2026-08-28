"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AgentContactFormProps {
  propertyTitle: string;
  propertyAddress: string;
}

export default function AgentContactForm({
  propertyTitle,
  propertyAddress,
}: AgentContactFormProps) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: `${t.propertyDetail.messagePlaceholder} (${propertyTitle})`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Agent Headshot & Details */}
      <div className="flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
          alt="Sarah Jenkins - Agente Inmobiliario"
          className="w-16 h-16 rounded-full object-cover border-2 border-mosque dark:border-emerald-400 shadow-xs"
        />
        <div>
          <h3 className="text-lg font-bold text-nordic dark:text-white">
            Sarah Jenkins
          </h3>
          <p className="text-xs font-semibold text-mosque dark:text-emerald-400">
            {t.propertyDetail.agentRole}
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-hint-of-green/40 dark:bg-emerald-950/60 border border-mosque/30 dark:border-emerald-500/40 rounded-xl p-4 text-center animate-fadeIn">
          <span className="material-symbols-outlined text-3xl text-mosque dark:text-emerald-400 mb-1">
            check_circle
          </span>
          <h4 className="text-sm font-bold text-nordic dark:text-white">
            {t.propertyDetail.successMessage}
          </h4>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              required
              placeholder={t.propertyDetail.fullName}
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full bg-clear-day dark:bg-[#0d1816] border border-nordic/10 dark:border-emerald-500/20 rounded-xl p-3 text-sm text-nordic dark:text-white focus:outline-none focus:border-mosque dark:focus:border-emerald-400 transition-all"
            />
          </div>
          <div>
            <input
              type="email"
              required
              placeholder={t.propertyDetail.email}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-clear-day dark:bg-[#0d1816] border border-nordic/10 dark:border-emerald-500/20 rounded-xl p-3 text-sm text-nordic dark:text-white focus:outline-none focus:border-mosque dark:focus:border-emerald-400 transition-all"
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder={t.propertyDetail.phone}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-clear-day dark:bg-[#0d1816] border border-nordic/10 dark:border-emerald-500/20 rounded-xl p-3 text-sm text-nordic dark:text-white focus:outline-none focus:border-mosque dark:focus:border-emerald-400 transition-all"
            />
          </div>
          <div>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full bg-clear-day dark:bg-[#0d1816] border border-nordic/10 dark:border-emerald-500/20 rounded-xl p-3 text-sm text-nordic dark:text-white focus:outline-none focus:border-mosque dark:focus:border-emerald-400 transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-mosque dark:bg-emerald-600 hover:bg-mosque/90 dark:hover:bg-emerald-500 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-sm active:scale-98 cursor-pointer"
          >
            {t.propertyDetail.sendButton}
          </button>
        </form>
      )}
    </div>
  );
}

