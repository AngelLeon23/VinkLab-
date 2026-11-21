import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { calcularCompatibilidades, textoProyecto, textoCampana } from "@/lib/matching";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { proyecto_id, campana_id } = await req.json();
    if (!proyecto_id || !campana_id) {
      return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
    }
    const db = supabaseAdmin();
    const [{ data: p, error: e1 }, { data: c, error: e2 }] = await Promise.all([
      db.from("proyectos").select("*").eq("id", proyecto_id).single(),
      db.from("campanas").select("*").eq("id", campana_id).single(),
    ]);
    if (e1 || e2) throw new Error("Proyecto o convocatoria no encontrados.");

    const [r] = await calcularCompatibilidades(
      { texto: textoProyecto(p), area: p.area },
      [{ id: c.id, texto: textoCampana(c), area: c.area }]
    );

    const { error } = await db
      .from("postulaciones")
      .upsert({ proyecto_id, campana_id, compatibilidad: r.score }, { onConflict: "proyecto_id,campana_id" });
    if (error) throw error;

    return NextResponse.json({ ok: true, compatibilidad: r.score });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Error al postular" }, { status: 500 });
  }
}
