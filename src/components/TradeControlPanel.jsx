import React from 'react';
import { useTradeActions } from '../hooks/useTradeActions';

export function TradeControlPanel() {
  const { isLoading, lastActionStatus, handleActionClick } = useTradeActions();

  // Botão menor e mais compacto para caber na barra superior
  const TradeButton = ({ label, colorClass, onClick }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${colorClass} text-white font-bold py-2 px-4 rounded-lg shadow-md 
                  text-sm transform transition-all duration-150 active:scale-95 hover:brightness-110
                  disabled:opacity-50 disabled:cursor-not-allowed tracking-wide whitespace-nowrap`}
    >
      {label}
    </button>
  );

  return (
    // Container flexível horizontal (linha) em vez de coluna
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Lado Esquerdo: Título e Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Trade<span className="text-blue-600">Bot</span>
        </h1>
        
        {/* Status Message (Pequena pílula ao lado do título) */}
        <div className={`text-xs font-semibold px-2 py-1 rounded border
          ${lastActionStatus?.type === 'success' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
            lastActionStatus?.type === 'error' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
          {lastActionStatus ? lastActionStatus.message : (isLoading ? 'Processing...' : 'Ready')}
        </div>
      </div>

      {/* Lado Direito: Botões alinhados horizontalmente */}
      <div className="flex items-center gap-2">
        <TradeButton 
          label="BUY" 
          colorClass="bg-emerald-600"
          onClick={() => handleActionClick('Buy')}
        />
        <TradeButton 
          label="SELL" 
          colorClass="bg-rose-600"
          onClick={() => handleActionClick('Sell')}
        />
        <TradeButton 
          label="TELEGRAM" 
          colorClass="bg-blue-600"
          onClick={() => handleActionClick('Send Telegram')}
        />
        <TradeButton 
          label="CHART" 
          colorClass="bg-slate-600"
          onClick={() => handleActionClick('Chart')}
        />
      </div>
    </div>
  );
}