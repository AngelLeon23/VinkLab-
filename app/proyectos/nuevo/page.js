import FormProyecto from "@/components/FormProyecto";

export const metadata = { title: "Publicar proyecto — VinkLab" };

export default function NuevoProyecto() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Publica tu proyecto</h1>
        <p className="text-slate-600">Cuéntanos tu idea; la IA te dará 3 mejoras antes de que la vean los inversionistas.</p>
      </div>
      <FormProyecto />
    </div>
  );
}
