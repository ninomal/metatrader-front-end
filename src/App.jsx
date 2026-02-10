import { useState } from 'react';
import { TradeControlPanel } from './components/TradeControlPanel';
import { CandleChart } from './components/CandleChart';

function App() {
  // Estado para controlar se mostramos o Gráfico ou o Placeholder vazio
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-950 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* 1. BARRA SUPERIOR (Navbar Branca Fixa) */}
      <div className="bg-white border-b border-slate-200 shadow-sm p-4 z-20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Passamos a função que inverte o valor de showChart (true <-> false) */}
          <TradeControlPanel onChartToggle={() => setShowChart(!showChart)} />
        </div>
      </div>
      
      {/* 2. ÁREA PRINCIPAL (Conteúdo Escuro) */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
        
        {showChart ? (
          // --- MODO GRÁFICO ATIVO ---
          <div className="w-full h-full max-w-7xl animate-fade-in shadow-2xl rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            <CandleChart />
          </div>
        ) : (
          // --- MODO DE ESPERA (Placeholder) ---
          <div className="text-center opacity-50 select-none">
            <div className="text-slate-700 text-8xl mb-4 animate-pulse">📊</div>
            <h2 className="text-slate-400 text-2xl font-light">Market Data Visualization</h2>
            <p className="text-slate-600 text-sm mt-2">Click "CHART" to load live candles</p>
          </div>
        )}

        {/* Efeito de Fundo Sutil (Radial Gradient) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10 pointer-events-none"></div>
      
      </div>
    </div>
  )
}

export default App