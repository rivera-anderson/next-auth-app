import { getSupabase } from "./supabase";

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password: string; // hash de bcrypt, nunca la contraseña en texto plano
  failed_attempts: number;
  lock_until: string | null;
  created_at: string;
}

export async function findUserByEmail(email: string) {
  const { data, error } = await getSupabase()
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle<UserRow>();
  if (error) throw new Error(error.message);
  return data;
}

export async function createUser(user: { name: string; email: string; password: string }) {
  const { error } = await getSupabase().from("users").insert(user);
  if (error) throw new Error(error.message);
}

export async function updateLoginState(
  id: string,
  failedAttempts: number,
  lockUntil: Date | null
) {
  const { error } = await getSupabase()
    .from("users")
    .update({
      failed_attempts: failedAttempts,
      lock_until: lockUntil ? lockUntil.toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
