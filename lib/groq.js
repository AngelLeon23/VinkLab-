// Llamadas a la API de Groq (compatible con el formato de OpenAI) usando Llama 3.
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function groqJSON(system, user) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Falta GROQ_API_KEY en .env.local");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Groq respondió ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "{}";
  return JSON.parse(content);
}

export const PROMPT_ASISTENTE = `Eres un asesor experto en gestión de la innovación y captación de fondos para ciencia y tecnología en México y Latinoamérica.
Recibirás la propuesta de un proyecto científico o tecnológico. Analízala y devuelve EXACTAMENTE 3 recomendaciones clave, concretas y accionables, para mejorar su redacción, claridad, justificación e impacto socioeconómico antes de publicarla ante empresas e inversionistas.
Responde SOLO con JSON válido en español con esta forma:
{"recomendaciones":[{"titulo":"máx. 8 palabras","detalle":"1 a 3 oraciones con la mejora sugerida y, si aplica, un ejemplo de redacción"}, {...}, {...}]}`;
