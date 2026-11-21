import Link from "next/link";
import { supabasePublic } from "@/lib/supabase";
import { money } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Campanas() {
  const { data: campanas, error } = await supabasePublic()
    .from("campanas")
    .select("*, usuarios(nombre)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Convocatorias y retos</h1>
          <p className="text-slate-600">Oportunidades publicadas por empresas e inversionistas.</p>
        </div>
        <Link href="/campanas/nueva" className="btn">Publicar convocatoria</Link>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error.message}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        {campanas?.map((c) => (
          <Link key={c.id} href={`/campanas/${c.id}`} className="card space-y-2 transition hover:shadow-md">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{c.area}</span>
            <h3 className="text-lg font-semibold text-slate-900">{c.titulo}</h3>
            <p className="line-clamp-3 text-sm text-slate-600">{c.descripcion}</p>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
              <span className="text-slate-500">{c.usuarios?.nombre}</span>
              <span className="font-semibold">{money(c.monto)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
