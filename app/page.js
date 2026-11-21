import Link from "next/link";
import { supabasePublic } from "@/lib/supabase";
import { AREAS } from "@/lib/constants";
import ProyectoCard from "@/components/ProyectoCard";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const sp = (await searchParams) || {};
  const area = sp.area || "";
  const max = Number(sp.max) || 0;
  const q = (sp.q || "").replace(/[,()%*]/g, " ").trim();

  let query = supabasePublic()
    .from("proyectos")
    .select("*, usuarios(nombre)")
    .order("created_at", { ascending: false });
  if (area) query = query.eq("area", area);
  if (max) query = query.lte("presupuesto", max);
  if (q) query = query.or(`titulo.ilike.%${q}%,descripcion.ilike.%${q}%`);

  const { data: proyectos, error } = await query;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-700 px-6 py-12 text-white sm:px-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-200">
          Innovación abierta · Ciencia y tecnología
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
          La ciencia que encuentra <br className="hidden sm:block" />
          a quien la financie.
        </h1>
        <p className="mt-4 max-w-2xl text-indigo-100">
          VinkLab conecta proyectos de investigación con empresas e inversionistas. Nuestra IA te ayuda a mejorar tu
          propuesta y calcula qué tan compatible es con cada convocatoria.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/proyectos/nuevo" className="btn !bg-white !text-indigo-800 hover:!bg-indigo-50">
            Publicar mi proyecto
          </Link>
          <Link href="/campanas/nueva" className="btn-ghost !border-indigo-300 !bg-transparent !text-white hover:!bg-white/10">
            Soy empresa / inversionista
          </Link>
        </div>
      </section>

      <form method="GET" className="card grid gap-3 sm:grid-cols-[1fr_200px_200px_auto]">
        <input name="q" defaultValue={q} placeholder="Buscar proyectos…" className="input" />
        <select name="area" defaultValue={area} className="input">
          <option value="">Todas las áreas</option>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select name="max" defaultValue={max || ""} className="input">
          <option value="">Cualquier presupuesto</option>
          <option value="100000">Hasta $100,000</option>
          <option value="250000">Hasta $250,000</option>
          <option value="500000">Hasta $500,000</option>
        </select>
        <button className="btn">Filtrar</button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          No se pudo leer la base de datos: {error.message}. Revisa tus claves de Supabase y que hayas ejecutado schema.sql.
        </p>
      )}

      {!error && proyectos?.length === 0 && (
        <p className="py-10 text-center text-slate-500">No hay proyectos con esos filtros.</p>
      )}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {proyectos?.map((p) => <ProyectoCard key={p.id} p={p} />)}
      </section>
    </div>
  );
}
