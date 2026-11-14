import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Cliente SOLO para el servidor: usa la "secret key" de Supabase (sb_secret_...).
// Nunca importes este archivo en un componente 'use client'.
export function getSupabase() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) {
      throw new Error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local");
    }
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
