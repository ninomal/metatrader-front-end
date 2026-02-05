import React from 'react';
import { useTradeActions } from '../hooks/useTradeActions';

export function TradeControlPanel() {
  const { isLoading, lastActionStatus, handleActionClick } = useTradeActions();

  // Reusable Button Component internal to this file
  const TradeButton = ({ label, colorClass, onClick }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${colorClass} text-white font-bold py-4 px-6 rounded-xl shadow-lg 
                  transform transition-all duration-150 active:scale-95 hover:brightness-110
                  disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-48 tracking-wider`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 flex flex-col items-center gap-6 relative">
      
      <h1 className="text-2xl font-bold text-slate-200 mb-2 tracking-tight">
        Command Center
      </h1>

      {/* Feedback Message Area */}
      <div className={`h-8 text-sm font-medium flex items-center transition-all duration-300
        ${lastActionStatus?.type === 'success' ? 'text-emerald-400' : 
          lastActionStatus?.type === 'error' ? 'text-rose-400' : 'text-blue-300'}`}>
        {lastActionStatus ? lastActionStatus.message : (isLoading ? 'Processing...' : 'Ready')}
      </div>
      
      {/* Grid for Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <TradeButton 
          label="BUY" 
          colorClass="bg-emerald-600 shadow-emerald-900/30"
          onClick={() => handleActionClick('Buy')}
        />
        <TradeButton 
          label="SELL" 
          colorClass="bg-rose-600 shadow-rose-900/30"
          onClick={() => handleActionClick('Sell')}
        />
        <TradeButton 
          label="SEND TELEGRAM" 
          colorClass="bg-blue-600 shadow-blue-900/30"
          onClick={() => handleActionClick('Send Telegram')}
        />
        {/* Changed "Charted" to "CHART" for better English phrasing */}
        <TradeButton 
          label="CHART" 
          colorClass="bg-slate-600 shadow-slate-900/30"
          onClick={() => handleActionClick('Chart')}
        />
      </div>
    </div>
  );
}