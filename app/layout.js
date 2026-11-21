import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "VinkLab — Ciencia que encuentra su inversión",
  description:
    "Marketplace de innovación abierta que vincula proyectos de ciencia y tecnología con empresas e inversionistas usando inteligencia artificial.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-xl font-bold text-slate-900">
              Vink<span className="text-indigo-600">Lab</span>
            </Link>
            <div className="flex items-center gap-1 text-sm font-medium sm:gap-3">
              <Link href="/" className="rounded-md px-2 py-1 hover:bg-slate-100">Proyectos</Link>
              <Link href="/campanas" className="rounded-md px-2 py-1 hover:bg-slate-100">Convocatorias</Link>
              <Link href="/proyectos/nuevo" className="btn !px-3 !py-1.5">Publicar</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          VinkLab · Prototipo académico · UT Tabasco — Fundamentos de Inteligencia Artificial
        </footer>
      </body>
    </html>
  );
}
