"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Process OAuth hash or code exchange if needed
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("OAuth callback error:", error.message);
        }
        if (data?.session || user) {
          router.replace("/");
        } else {
          // In case PKCE or hash takes a fraction of second, check again after short delay
          setTimeout(() => {
            router.replace("/");
          }, 800);
        }
      } catch (e) {
        console.error("Callback exception:", e);
        router.replace("/");
      }
    };

    handleAuthCallback();
  }, [router, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-clear-day dark:bg-[#0d1816] text-nordic dark:text-[#e6f3f0] p-6">
      <div className="flex flex-col items-center gap-4 bg-white/80 dark:bg-[#142421]/90 backdrop-blur-md p-8 rounded-2xl border border-nordic/10 dark:border-emerald-500/20 shadow-xl max-w-sm w-full text-center">
        <div className="w-12 h-12 rounded-full border-4 border-mosque/20 border-t-mosque dark:border-emerald-500/30 dark:border-t-emerald-400 animate-spin"></div>
        <h2 className="text-xl font-bold text-nordic dark:text-white">
          Verificando sesión...
        </h2>
        <p className="text-sm text-nordic/70 dark:text-emerald-100/70">
          EstateFlow está autenticando tus credenciales de forma segura.
        </p>
      </div>
    </div>
  );
}
