import { TradeControlPanel } from './components/TradeControlPanel';

function App() {
  return (
    // Main container: Dark background, centering with flexbox
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Subtle background effect (optional) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 -z-10"></div>
      
      <TradeControlPanel />
      
    </div>
  )
}

export default App