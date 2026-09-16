import { createClient } from "@supabase/supabase-js";

/**
 * Service Role Admin Supabase Client (Server-only)
 * Digunakan untuk mutasi database yang memerlukan wewenang sistem (bypassing RLS untuk sinkronisasi atomik demo).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
