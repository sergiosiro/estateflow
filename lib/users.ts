import { supabase } from "./supabase/client";
import { UserProfile } from "./auth/AuthContext";

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: "admin" | "user";
}

export async function getAllProfiles(): Promise<{
  data: UserProfile[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching profiles:", error.message);
      return { data: null, error: error.message };
    }

    return { data: (data as UserProfile[]) || [], error: null };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    return { data: null, error: errorObj?.message || "Error desconocido al obtener usuarios" };
  }
}

export async function adminCreateUser(
  userData: CreateUserData
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabase.rpc("admin_create_user", {
      p_email: userData.email,
      p_password: userData.password,
      p_full_name: userData.fullName,
      p_role: userData.role,
    });

    if (error) {
      console.error("RPC admin_create_user error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    return { success: false, error: errorObj?.message || "Error al crear usuario" };
  }
}

export async function adminUpdateRole(
  userId: string,
  newRole: "admin" | "user"
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("admin_update_user_role", {
      p_target_user_id: userId,
      p_new_role: newRole,
    });

    if (error) {
      // Fallback direct update on public.profiles
      const { error: directErr } = await supabase
        .from("profiles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (directErr) {
        return { success: false, error: directErr.message };
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    return { success: false, error: errorObj?.message || "Error al actualizar rol" };
  }
}

export async function adminUpdateStatus(
  userId: string,
  newStatus: "active" | "suspended" | "pending"
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("admin_update_user_status", {
      p_target_user_id: userId,
      p_new_status: newStatus,
    });

    if (error) {
      // Fallback direct update on public.profiles
      const { error: directErr } = await supabase
        .from("profiles")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (directErr) {
        return { success: false, error: directErr.message };
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    return { success: false, error: errorObj?.message || "Error al actualizar estado" };
  }
}

export async function adminDeleteUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("admin_delete_user", {
      p_target_user_id: userId,
    });

    if (error) {
      // Fallback direct delete on public.profiles
      const { error: directErr } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (directErr) {
        return { success: false, error: directErr.message };
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    return { success: false, error: errorObj?.message || "Error al eliminar usuario" };
  }
}
