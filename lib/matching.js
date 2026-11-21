// Motor de compatibilidad (matching) entre un proyecto y convocatorias.
// 1) Intenta embeddings semánticos (Hugging Face) + similitud coseno.
// 2) Si no hay token o falla, usa un respaldo local (bolsa de palabras + coseno).
// 3) Se combina con un bonus por coincidir en el área tecnológica.

const STOP = new Set(
  "de la el en y a los las un una unos unas del al por para con sin sobre entre que se su sus es son como mas pero o u e lo le les este esta estos estas ese esa para desde hasta muy ya no si tambien ser tiene tienen puede pueden permite busca buscamos proyecto sistema desarrollo desarrollar".split(
    " "
  )
);

function normalizar(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function bolsa(texto) {
  const m = new Map();
  for (const w of normalizar(texto).split(/\s+/)) {
    if (w.length < 3 || STOP.has(w)) continue;
    // "stemming" muy simple: recorta plurales
    const t = w.length > 5 ? w.replace(/(es|s)$/, "") : w;
    m.set(t, (m.get(t) || 0) + 1);
  }
  return m;
}

function cosenoMapas(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const [, v] of a) na += v * v;
  for (const [, v] of b) nb += v * v;
  for (const [k, v] of a) if (b.has(k)) dot += v * b.get(k);
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export function cosenoVectores(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

async function embeddings(textos) {
  const token = process.env.HF_TOKEN;
  if (!token) return null;
  const model = process.env.HF_MODEL || "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(
      `https://router.huggingface.co/hf-inference/models/${model}/pipeline/feature-extraction`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: textos, options: { wait_for_model: true } }),
        signal: ctrl.signal,
      }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length !== textos.length) return null;
    if (!Array.isArray(data[0]) || typeof data[0][0] !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

const clamp = (x) => Math.max(0, Math.min(1, x));

/**
 * base: { texto, area }
 * candidatos: [{ id, texto, area }]
 * Devuelve [{ id, score (0-100), metodo }]
 */
export async function calcularCompatibilidades(base, candidatos) {
  if (!candidatos.length) return [];
  const textos = [base.texto, ...candidatos.map((c) => c.texto)];
  const vecs = await embeddings(textos);

  return candidatos.map((c, i) => {
    let semantico, metodo;
    if (vecs) {
      const cos = cosenoVectores(vecs[0], vecs[i + 1]);
      semantico = clamp((cos - 0.15) / 0.55); // calibración: 0.15 => 0 %, 0.70 => 100 %
      metodo = "embeddings";
    } else {
      const cos = cosenoMapas(bolsa(base.texto), bolsa(c.texto));
      semantico = clamp(cos / 0.35); // calibración para bolsa de palabras
      metodo = "palabras-clave";
    }
    const bonusArea = base.area && base.area === c.area ? 1 : 0;
    const score = Math.round((0.85 * semantico + 0.15 * bonusArea) * 100);
    return { id: c.id, score, metodo };
  });
}

export const textoProyecto = (p) => `${p.titulo}. ${p.area}. ${p.descripcion} ${p.impacto || ""}`;
export const textoCampana = (c) => `${c.titulo}. ${c.area}. ${c.descripcion} ${c.requisitos || ""}`;
