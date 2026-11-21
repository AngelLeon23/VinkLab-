"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostularButton({ proyectoId, campanaId, yaPostulado }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function postular() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/postulaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proyecto_id: proyectoId, campana_id: campanaId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (yaPostulado) {
    return <span className="text-sm font-semibold text-emerald-600">✓ Postulado</span>;
  }
  return (
    <div>
      <button onClick={postular} disabled={loading} className="btn !px-3 !py-1.5">
        {loading ? "Enviando…" : "Postular"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
