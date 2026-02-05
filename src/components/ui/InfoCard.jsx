export function InfoCard({ label, value, highlight = false }) {
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</span>
      <div className={`text-2xl font-mono font-bold mt-1 ${highlight ? 'text-green-400' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}