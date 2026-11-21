import { createClient } from "@supabase/supabase-js";

// Cliente de solo lectura (clave anon). Se usa en las paginas del servidor.
export function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Cliente con permisos de escritura (service role). SOLO en rutas /api (servidor).
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env.local");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
