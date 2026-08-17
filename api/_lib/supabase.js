import { createClient } from "@supabase/supabase-js";

let client;

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("Supabase environment is not configured");
  if (!client) {
    client = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { "X-Client-Info": "objeto2a-cms-server" } },
    });
  }
  return client;
}
