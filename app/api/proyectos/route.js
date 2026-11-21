import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { AREAS, EMAIL_RE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const b = await req.json();
    const titulo = (b.titulo || "").trim();
    const descripcion = (b.descripcion || "").trim();
    const impacto = (b.impacto || "").trim();
    const nombre = (b.nombre || "").trim();
    const email = (b.email || "").trim().toLowerCase();
    const presupuesto = Number(b.presupuesto);

    if (titulo.length < 5 || titulo.length > 120) return bad("El título debe tener entre 5 y 120 caracteres.");
    if (!AREAS.includes(b.area)) return bad("Selecciona un área válida.");
    if (descripcion.length < 30 || descripcion.length > 3000) return bad("La descripción debe tener entre 30 y 3000 caracteres.");
    if (!nombre) return bad("Escribe tu nombre.");
    if (!EMAIL_RE.test(email)) return bad("Correo electrónico inválido.");
    if (!Number.isFinite(presupuesto) || presupuesto < 0) return bad("Presupuesto inválido.");

    const db = supabaseAdmin();
    const { data: user, error: e1 } = await db
      .from("usuarios")
      .upsert({ nombre, email, rol: "creador" }, { onConflict: "email" })
      .select("id")
      .single();
    if (e1) throw e1;

    const { data, error } = await db
      .from("proyectos")
      .insert({ usuario_id: user.id, titulo, area: b.area, descripcion, impacto, presupuesto })
      .select("id")
      .single();
    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Error al guardar" }, { status: 500 });
  }
}

function bad(msg) {
  return NextResponse.json({ error: msg }, { status: 400 });
}
