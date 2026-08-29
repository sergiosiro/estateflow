"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "user";
  status: "active" | "suspended" | "pending";
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  userRole: "admin" | "user" | null;
  isAdmin: boolean;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to set and clear cookies for Next.js Middleware
function setAuthCookies(userId: string, role: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `ef_user_role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `ef_auth=${userId}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookies() {
  if (typeof document === "undefined") return;
  document.cookie = "ef_user_role=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "ef_auth=; path=/; max-age=0; SameSite=Lax";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrCreateProfile = async (currentUser: User): Promise<UserProfile | null> => {
    try {
      // 1. Check if profile exists
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!error && data) {
        const userProf = data as UserProfile;
        setProfile(userProf);
        setAuthCookies(userProf.id, userProf.role);
        return userProf;
      }

      // 2. Profile doesn't exist yet -> Create it as regular 'user'
      const fullName =
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        currentUser.email?.split("@")[0] ||
        "Usuario";
      const avatarUrl =
        currentUser.user_metadata?.avatar_url ||
        currentUser.user_metadata?.picture ||
        "";

      const newProfile: Partial<UserProfile> = {
        id: currentUser.id,
        email: currentUser.email || "",
        full_name: fullName,
        avatar_url: avatarUrl,
        role: "user",
        status: "active",
      };

      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .upsert(newProfile)
        .select("*")
        .single();

      if (!insertError && inserted) {
        const userProf = inserted as UserProfile;
        setProfile(userProf);
        setAuthCookies(userProf.id, userProf.role);
        return userProf;
      }
    } catch (e) {
      console.error("Error fetching or creating user profile:", e);
    }
    return null;
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) {
      setProfile(null);
      clearAuthCookies();
      return null;
    }
    return fetchOrCreateProfile(user);
  };

  useEffect(() => {
    // 1. Initial Session Check
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error.message);
        }
        setSession(data.session);
        const currentUser = data.session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchOrCreateProfile(currentUser);
        } else {
          setProfile(null);
          clearAuthCookies();
        }
      } catch (err) {
        console.error("Unexpected error getting session:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Auth State Change Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchOrCreateProfile(currentUser);
        } else {
          setProfile(null);
          clearAuthCookies();
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error && data.user) {
        await fetchOrCreateProfile(data.user);
      }
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (!error && data.user) {
        await fetchOrCreateProfile(data.user);
      }
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      clearAuthCookies();
      setProfile(null);
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login?reset=true`
            : undefined,
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const userRole = profile?.role ?? null;
  const isAdmin = userRole === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        userRole,
        isAdmin,
        session,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        resetPasswordForEmail,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
