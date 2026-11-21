import Link from "next/link";
import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabase";
import { money } from "@/lib/constants";
import { calcularCompatibilidades, textoProyecto, textoCampana } from "@/lib/matching";
import MatchBar from "@/components/MatchBar";
import PostularButton from "@/components/PostularButton";

export const dynamic = "force-dynamic";

export default async function ProyectoPage({ params }) {
    const { id } = await params;
  const db = supabasePublic();
  const { data: p } = await db.from("proyectos").select("*, usuarios(nombre,email)").eq("id", id).maybeSingle();
  if (!p) notFound();

  const [{ data: campanas }, { data: posts }] = await Promise.all([
    db.from("campanas").select("*, usuarios(nombre,email)"),
    db.from("postulaciones").select("campana_id").eq("proyecto_id", p.id),
  ]);
  const postuladas = new Set((posts || []).map((x) => x.campana_id));

  const scores = await calcularCompatibilidades(
    { texto: textoProyecto(p), area: p.area },
    (campanas || []).map((c) => ({ id: c.id, texto: textoCampana(c), area: c.area }))
  );
  const ranking = (campanas || [])
    .map((c) => ({ ...c, score: scores.find((s) => s.id === c.id)?.score ?? 0 }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <article className="card space-y-4">
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">{p.area}</span>
        <h1 className="font-display text-3xl font-bold text-slate-900">{p.titulo}</h1>
        <p className="whitespace-pre-line text-slate-700">{p.descripcion}</p>
        {p.impacto && (
          <>
            <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Impacto socioeconómico</h2>
            <p className="whitespace-pre-line text-slate-700">{p.impacto}</p>
          </>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Presupuesto requerido</p>
            <p className="text-xl font-bold text-slate-900">{money(p.presupuesto)}</p>
          </div>
          <a
            className="btn"
            href={`mailto:${p.usuarios?.email}?subject=${encodeURIComponent("Interés en tu proyecto: " + p.titulo)}`}
          >
            ✉ Contactar a {p.usuarios?.nombre}
          </a>
        </div>
      </article>

      <aside className="space-y-3">
        <h2 className="font-semibold text-slate-900">Convocatorias compatibles</h2>
        {ranking.map((c) => (
          <div key={c.id} className="card space-y-3 !p-4">
            <Link href={`/campanas/${c.id}`} className="font-medium text-slate-900 hover:text-indigo-700">
              {c.titulo}
            </Link>
            <MatchBar score={c.score} />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Monto: {money(c.monto)}</span>
              <PostularButton proyectoId={p.id} campanaId={c.id} yaPostulado={postuladas.has(c.id)} />
            </div>
          </div>
        ))}
        {ranking.length === 0 && <p className="text-sm text-slate-500">Aún no hay convocatorias.</p>}
      </aside>
    </div>
  );
}
