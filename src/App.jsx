import { useBotLogic } from './hooks/useBotLogic';
import { StatusBadge } from './components/ui/StatusBadge';
import { InfoCard } from './components/ui/InfoCard';
import { ActionButton } from './components/ui/ActionButton';
import { LogTerminal } from './components/dashboard/LogTerminal';

function App() {
  // Chamamos nosso Hook Customizado
  const { status, logs, loading, toggleBot } = useBotLogic();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4 font-sans selection:bg-cyan-500 selection:text-black">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Faixa Decorativa */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500"></div>

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Trade<span className="text-cyan-400">Bot</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Painel de Controle MT5</p>
            </div>
            <StatusBadge isRunning={status.is_running} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <InfoCard label="Ativo Monitorado" value={status.symbol} />
            <InfoCard 
              label="Status Atual" 
              value={status.is_running ? 'EXECUTANDO' : 'AGUARDANDO'} 
              highlight={status.is_running} 
            />
          </div>

          {/* Botões de Controle */}
          <div className="flex gap-4 mb-8">
            <ActionButton 
              action="start" 
              loading={loading} 
              isRunning={status.is_running} 
              onClick={() => toggleBot('start')} 
            />
            <ActionButton 
              action="stop" 
              loading={loading} 
              isRunning={status.is_running} 
              onClick={() => toggleBot('stop')} 
            />
          </div>

          {/* Logs */}
          <LogTerminal logs={logs} />
        </div>
      </div>
    </div>
  );
}

export default App;