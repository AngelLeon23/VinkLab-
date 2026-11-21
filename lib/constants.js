export const AREAS = [
  "Biotecnología",
  "Electrónica",
  "Software",
  "Salud",
  "Energía",
  "Agroindustria",
  "Medio ambiente",
  "Materiales",
];

export function money(n) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
