"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AREAS } from "@/lib/constants";

export default function FormProyecto() {
  const router = useRouter();
  const [f, setF] = useState({
    titulo: "", area: AREAS[0], descripcion: "", impacto: "", presupuesto: "", nombre: "", email: "",
  });
  const [recs, setRecs] = useState([]);
  const [ia, setIa] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function pedirMejoras() {
    setIa(true);
    setError("");
    setRecs([]);
    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecs(data.recomendaciones);
    } catch (e) {
      setError(e.message);
    } finally {
      setIa(false);
    }
  }

  async function publicar(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/proyectos/${data.id}`);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <form onSubmit={publicar} className="card space-y-4">
        <Field label="Título del proyecto">
          <input className="input" required value={f.titulo} onChange={set("titulo")} maxLength={120} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Área tecnológica">
            <select className="input" value={f.area} onChange={set("area")}>
              {AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Presupuesto requerido (MXN)">
            <input className="input" type="number" min="0" required value={f.presupuesto} onChange={set("presupuesto")} />
          </Field>
        </div>
        <Field label="Descripción">
          <textarea className="input min-h-[130px]" required value={f.descripcion} onChange={set("descripcion")} />
        </Field>
        <Field label="Impacto socioeconómico">
          <textarea className="input min-h-[80px]" value={f.impacto} onChange={set("impacto")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tu nombre o equipo">
            <input className="input" required value={f.nombre} onChange={set("nombre")} />
          </Field>
          <Field label="Correo de contacto">
            <input className="input" type="email" required value={f.email} onChange={set("email")} />
          </Field>
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={pedirMejoras} disabled={ia} className="btn-ghost">
            {ia ? "Analizando…" : "✨ Pedir 3 mejoras a la IA"}
          </button>
          <button type="submit" disabled={saving} className="btn">
            {saving ? "Publicando…" : "Publicar proyecto"}
          </button>
        </div>
      </form>

      <aside className="card h-fit space-y-3 bg-gradient-to-b from-indigo-50 to-white">
        <h2 className="font-semibold text-slate-900">Asistente de redacción</h2>
        {recs.length === 0 && (
          <p className="text-sm text-slate-600">
            Escribe tu descripción y pulsa “Pedir 3 mejoras a la IA”. Recibirás sugerencias antes de publicar.
          </p>
        )}
        {recs.map((r, i) => (
          <div key={i} className="rounded-xl border border-indigo-100 bg-white p-3">
            <p className="text-sm font-semibold text-indigo-700">{i + 1}. {r.titulo}</p>
            <p className="mt-1 text-sm text-slate-700">{r.detalle}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
