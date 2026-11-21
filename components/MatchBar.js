export default function MatchBar({ score }) {
  const color =
    score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-slate-400";
  return (
    <div className="w-full">
      <div className="mb-1 flex items-baseline justify-between text-xs font-semibold text-slate-600">
        <span>Compatibilidad</span>
        <span className="text-sm text-slate-900">{score}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
