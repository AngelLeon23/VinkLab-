import Link from "next/link";
import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabase";
import { money } from "@/lib/constants";
import { calcularCompatibilidades, textoProyecto, textoCampana } from "@/lib/matching";
import MatchBar from "@/components/MatchBar";

export const dynamic = "force-dynamic";

export default async function CampanaPage({ params }) {
    const { id } = await params;
  const db = supabasePublic();
  const { data: c } = await db.from("campanas").select("*, usuarios(nombre,email)").eq("id", id).maybeSingle();
  if (!c) notFound();

  const [{ data: proyectos }, { data: posts }] = await Promise.all([
    db.from("proyectos").select("*, usuarios(nombre,email)"),
    db.from("postulaciones").select("proyecto_id").eq("campana_id", c.id),
  ]);
  const postulados = new Set((posts || []).map((x) => x.proyecto_id));

  const scores = await calcularCompatibilidades(
    { texto: textoCampana(c), area: c.area },
    (proyectos || []).map((p) => ({ id: p.id, texto: textoProyecto(p), area: p.area }))
  );
  const ranking = (proyectos || [])
    .map((p) => ({ ...p, score: scores.find((s) => s.id === p.id)?.score ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const metodo = scores[0]?.metodo === "embeddings" ? "embeddings semánticos" : "palabras clave (respaldo)";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <article className="card h-fit space-y-4">
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{c.area}</span>
        <h1 className="font-display text-3xl font-bold text-slate-900">{c.titulo}</h1>
        <p className="whitespace-pre-line text-slate-700">{c.descripcion}</p>
        {c.requisitos && (
          <>
            <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Requisitos</h2>
            <p className="whitespace-pre-line text-slate-700">{c.requisitos}</p>
          </>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Monto disponible · cierre {c.fecha_cierre || "abierto"}</p>
            <p className="text-xl font-bold text-slate-900">{money(c.monto)}</p>
          </div>
          <a className="btn" href={`mailto:${c.usuarios?.email}?subject=${encodeURIComponent("Postulación: " + c.titulo)}`}>
            ✉ Contactar a {c.usuarios?.nombre}
          </a>
        </div>
      </article>

      <aside className="space-y-3">
        <div>
          <h2 className="font-semibold text-slate-900">Proyectos más compatibles</h2>
          <p className="text-xs text-slate-500">Calculado con {metodo}.</p>
        </div>
        {ranking.map((p) => (
          <div key={p.id} className="card space-y-3 !p-4">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/proyectos/${p.id}`} className="font-medium text-slate-900 hover:text-indigo-700">
                {p.titulo}
              </Link>
              {postulados.has(p.id) && <span className="shrink-0 text-xs font-semibold text-emerald-600">✓ Postulado</span>}
            </div>
            <MatchBar score={p.score} />
          </div>
        ))}
      </aside>
    </div>
  );
}
