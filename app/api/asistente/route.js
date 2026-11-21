import { NextResponse } from "next/server";
import { groqJSON, PROMPT_ASISTENTE } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { titulo, area, descripcion, impacto } = await req.json();
    if (!descripcion || descripcion.trim().length < 30) {
      return NextResponse.json(
        { error: "Escribe una descripción de al menos 30 caracteres para poder analizarla." },
        { status: 400 }
      );
    }
    const user = `Título: ${titulo || "(sin título)"}
Área: ${area || "(sin área)"}
Descripción: ${descripcion}
Impacto socioeconómico: ${impacto || "(no indicado)"}`;

    const out = await groqJSON(PROMPT_ASISTENTE, user);
    const recs = Array.isArray(out.recomendaciones) ? out.recomendaciones.slice(0, 3) : [];
    if (!recs.length) throw new Error("La IA no devolvió recomendaciones");
    return NextResponse.json({ recomendaciones: recs });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Error en el asistente" }, { status: 500 });
  }
}
