export function LogTerminal({ logs }) {
  return (
    <div className="bg-black/40 rounded-xl border border-slate-800 p-4 font-mono text-xs h-32 overflow-hidden flex flex-col justify-end">
      <div className="flex flex-col-reverse gap-1.5">
        {logs.map((log, index) => (
          <div key={index} className={`${index === 0 ? 'text-cyan-300' : 'text-slate-500'} transition-opacity`}>
            <span className="opacity-50 mr-2">{'>'}</span>{log}
          </div>
        ))}
      </div>
    </div>
  );
}