export function ActionButton({ action, loading, isRunning, onClick }) {
  // Lógica visual: Botão de Start deve sumir/desabilitar se já estiver rodando, etc.
  const isStart = action === 'start';
  const disabled = loading || (isStart ? isRunning : !isRunning);
  
  const baseStyle = "flex-1 py-4 rounded-xl font-bold text-sm tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-2";
  const activeStyle = isStart
    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 border border-emerald-500/50"
    : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 border border-rose-500/50";
  
  const disabledStyle = "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${disabled ? disabledStyle : activeStyle}`}
    >
      {loading && !disabled ? 'PROCESSANDO...' : isStart ? 'INICIAR SISTEMA' : 'PARAR SISTEMA'}
    </button>
  );
}