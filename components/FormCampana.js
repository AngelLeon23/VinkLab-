"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AREAS } from "@/lib/constants";

export default function FormCampana() {
  const router = useRouter();
  const [f, setF] = useState({
    titulo: "", area: AREAS[0], descripcion: "", requisitos: "", monto: "", fecha_cierre: "", nombre: "", email: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function publicar(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/campanas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/campanas/${data.id}`);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={publicar} className="card mx-auto max-w-2xl space-y-4">
      <Field label="Título del reto o convocatoria">
        <input className="input" required value={f.titulo} onChange={set("titulo")} maxLength={120} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Área">
          <select className="input" value={f.area} onChange={set("area")}>
            {AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
        </Field>
        <Field label="Monto disponible (MXN)">
          <input className="input" type="number" min="0" required value={f.monto} onChange={set("monto")} />
        </Field>
        <Field label="Fecha de cierre">
          <input className="input" type="date" value={f.fecha_cierre} onChange={set("fecha_cierre")} />
        </Field>
      </div>
      <Field label="¿Qué buscan?">
        <textarea className="input min-h-[120px]" required value={f.descripcion} onChange={set("descripcion")} />
      </Field>
      <Field label="Requisitos">
        <textarea className="input min-h-[80px]" value={f.requisitos} onChange={set("requisitos")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Empresa o institución">
          <input className="input" required value={f.nombre} onChange={set("nombre")} />
        </Field>
        <Field label="Correo de contacto">
          <input className="input" type="email" required value={f.email} onChange={set("email")} />
        </Field>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={saving} className="btn">
        {saving ? "Publicando…" : "Publicar convocatoria"}
      </button>
    </form>
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
