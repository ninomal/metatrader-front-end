import { useState } from 'react';
import { TradeControlPanel } from './components/TradeControlPanel';
import { CandleChart } from './components/CandleChart';
import { SymbolSelector } from './components/SymbolSelector'; 

function App() {
  // State to toggle between Chart view and Placeholder view
  const [showChart, setShowChart] = useState(false);
  
  // Global State for the active Symbol (Defaulting to EURUSD)
  const [currentSymbol, setCurrentSymbol] = useState("EURUSD"); 

  return (
    <div className="h-screen flex flex-col bg-slate-950 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="bg-white border-b border-slate-200 shadow-sm p-4 z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* LEFT SECTION: Symbol Selector */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <SymbolSelector 
              currentSymbol={currentSymbol} 
              onSymbolChange={(newSym) => setCurrentSymbol(newSym)} 
            />
          </div>

          {/* RIGHT SECTION: Control Buttons */}
          <div className="flex-1 w-full md:w-auto flex justify-end">
             {/* We pass the toggle function to the panel */}
            <TradeControlPanel onChartToggle={() => setShowChart(!showChart)} />
          </div>

        </div>
      </div>
      
      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
        
        {showChart ? (
          // CHART VIEW: Pass the current symbol prop to trigger data reload
          <div className="w-full h-full max-w-7xl animate-fade-in shadow-2xl rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            <CandleChart symbol={currentSymbol} /> 
          </div>
        ) : (
          // PLACEHOLDER VIEW
          <div className="text-center opacity-50 select-none">
            <div className="text-slate-700 text-8xl mb-4 animate-pulse">📊</div>
            <h2 className="text-slate-400 text-2xl font-light">
              Active Asset: <span className="text-cyan-500 font-bold">{currentSymbol}</span>
            </h2>
            <p className="text-slate-600 text-sm mt-2">Click "CHART" to load live data</p>
          </div>
        )}

        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10 pointer-events-none"></div>
      
      </div>
    </div>
  )
}

export default App