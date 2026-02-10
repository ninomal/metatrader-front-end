import React from 'react';
import { useTradeActions } from '../hooks/useTradeActions';

// Recebemos a prop 'onChartToggle' para controlar a visibilidade do gráfico no App.jsx
export function TradeControlPanel({ onChartToggle }) {
  const { isLoading, lastActionStatus, handleActionClick } = useTradeActions();

  // Componente interno de Botão (Estilo compacto para Navbar)
  const TradeButton = ({ label, colorClass, onClick }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${colorClass} text-white font-bold py-2 px-6 rounded-lg shadow-md 
                  text-sm transform transition-all duration-150 active:scale-95 hover:brightness-110
                  disabled:opacity-50 disabled:cursor-not-allowed tracking-wide whitespace-nowrap`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Lado Esquerdo: Título e Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Trade<span className="text-blue-600">Bot</span>
        </h1>
        
        {/* Badge de Status (Feedback Visual) */}
        <div className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors duration-300
          ${lastActionStatus?.type === 'success' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
            lastActionStatus?.type === 'error' ? 'bg-rose-100 text-rose-700 border-rose-200' : 
            'bg-slate-100 text-slate-600 border-slate-200'}`}>
          {lastActionStatus ? lastActionStatus.message : (isLoading ? 'Processing...' : 'Ready')}
        </div>
      </div>

      {/* Lado Direito: Botões de Ação */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
        <TradeButton 
          label="BUY" 
          colorClass="bg-emerald-600 hover:bg-emerald-500"
          onClick={() => handleActionClick('Buy')}
        />
        <TradeButton 
          label="SELL" 
          colorClass="bg-rose-600 hover:bg-rose-500"
          onClick={() => handleActionClick('Sell')}
        />
        <TradeButton 
          label="TELEGRAM" 
          colorClass="bg-blue-600 hover:bg-blue-500"
          onClick={() => handleActionClick('Send Telegram')}
        />
        
        {/* O Botão CHART apenas troca a visualização na tela */}
        <TradeButton 
          label="CHART" 
          colorClass="bg-slate-600 hover:bg-slate-500"
          onClick={onChartToggle}
        />
      </div>
    </div>
  );
}