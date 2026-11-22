import FormCampana from "@/components/FormCampana";

export const metadata = { title: "Publicar convocatoria — VinkLab" };

export default function NuevaCampana() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-slate-900">Publica una convocatoria</h1>
        <p className="text-slate-600">Describe el reto o fondo y te mostraremos los proyectos más compatibles.</p>
      </div>
      <FormCampana />
    </div>
  );
}
