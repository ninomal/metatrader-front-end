import { TradeControlPanel } from './components/TradeControlPanel';

function App() {
  return (
    // Layout Flex Vertical: Topo fixo + Resto preenchendo a tela
    <div className="h-screen flex flex-col bg-slate-950 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. BARRA SUPERIOR (Navbar Branca) */}
      <div className="bg-white border-b border-slate-200 shadow-sm p-4 z-10">
        <div className="max-w-7xl mx-auto">
          <TradeControlPanel />
        </div>
      </div>
      
      {/* 2. ÁREA DO GRÁFICO (Conteúdo Principal) */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
        
        {/* Placeholder: Aqui é onde o gráfico vai entrar depois */}
        <div className="text-center">
          <div className="text-slate-700 text-6xl mb-4 opacity-20">📊</div>
          <p className="text-slate-500 text-lg">Chart Area</p>
          <p className="text-slate-600 text-sm mt-2">Waiting for data...</p>
        </div>

        {/* Fundo sutil (opcional) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 -z-10"></div>
      
      </div>
    </div>
  )
}

export default App