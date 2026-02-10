import React, { useState, useEffect } from 'react';

/**
 * Component to select the active trading symbol.
 * Uses an HTML datalist for autocomplete functionality.
 */
export function SymbolSelector({ currentSymbol, onSymbolChange }) {
  const [symbols, setSymbols] = useState([]);
  const [inputValue, setInputValue] = useState(currentSymbol);
  
  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  // Effect: Fetch all available symbols on component mount
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch(`${API_URL}/symbols`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setSymbols(data);
        }
      } catch (error) {
        console.error("Error fetching symbols:", error);
      }
    };
    fetchSymbols();
  }, []);

  // Handle user typing in the input
  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    setInputValue(val);
    
    // Immediate update if the typed value matches a valid symbol
    if (symbols.includes(val)) {
      onSymbolChange(val);
    }
  };

  // Force update on blur (losing focus) or pressing Enter
  const handleBlur = () => {
    if (inputValue !== currentSymbol) {
      onSymbolChange(inputValue);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
        Asset / Symbol
      </label>
      <div className="relative group">
        <input 
          list="symbol-list" 
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ex: EURUSD"
          className="bg-slate-100 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2 font-bold uppercase transition-all"
        />
        {/* Native HTML Datalist for lightweight autocomplete */}
        <datalist id="symbol-list">
          {symbols.map((sym) => (
            <option key={sym} value={sym} />
          ))}
        </datalist>
      </div>
    </div>
  );
}