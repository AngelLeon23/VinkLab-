import Link from "next/link";
import { money } from "@/lib/constants";

export default function ProyectoCard({ p }) {
  return (
    <Link
      href={`/proyectos/${p.id}`}
      className="card flex flex-col gap-3 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="w-fit rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
        {p.area}
      </span>
      <h3 className="text-lg font-semibold leading-snug text-slate-900">{p.titulo}</h3>
      <p className="line-clamp-3 text-sm text-slate-600">{p.descripcion}</p>
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
        <span className="text-slate-500">{p.usuarios?.nombre || "Creador"}</span>
        <span className="font-semibold text-slate-900">{money(p.presupuesto)}</span>
      </div>
    </Link>
  );
}
