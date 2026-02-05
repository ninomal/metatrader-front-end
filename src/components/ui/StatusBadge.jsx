export function StatusBadge({ isRunning }) {
  const styles = isRunning
    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
    : 'bg-red-500/10 border-red-500/30 text-red-400 shadow-red-500/10';

  return (
    <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 shadow-lg transition-all duration-300 ${styles}`}>
      <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
      <span className="text-xs font-bold tracking-wider uppercase">
        {isRunning ? 'ONLINE' : 'OFFLINE'}
      </span>
    </div>
  );
}