import React, { useState, useEffect, useRef } from 'react';

/**
 * Custom Combobox Component for Symbol Selection.
 * Features: Type-to-filter, "V" dropdown button, and custom list styling.
 */
export function SymbolSelector({ currentSymbol, onSymbolChange }) {
  const [symbols, setSymbols] = useState([]);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [inputValue, setInputValue] = useState(currentSymbol);
  const [isOpen, setIsOpen] = useState(false);
  
  // Ref to handle clicking outside to close the dropdown
  const wrapperRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  // 1. Fetch available symbols on mount
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch(`${API_URL}/symbols`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setSymbols(data);
          setFilteredSymbols(data);
        }
      } catch (error) {
        console.error("Error fetching symbols:", error);
      }
    };
    fetchSymbols();
  }, []);

  // 2. Filter list when user types
  useEffect(() => {
    if (inputValue === "") {
      setFilteredSymbols(symbols);
    } else {
      const filtered = symbols.filter(sym => 
        sym.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSymbols(filtered);
    }
  }, [inputValue, symbols]);

  // 3. Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset input to current valid symbol if user left it half-typed
        if (!symbols.includes(inputValue)) {
           setInputValue(currentSymbol);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentSymbol, inputValue, symbols]);

  // Handlers
  const handleSelect = (symbol) => {
    setInputValue(symbol);
    onSymbolChange(symbol);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    // If opening, reset filter to show all (or keep current filter? let's show all for better UX)
    if (!isOpen) {
        setFilteredSymbols(symbols);
    }
  };

  return (
    <div className="flex flex-col relative" ref={wrapperRef}>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
        Asset / Symbol
      </label>
      
      <div className="relative group w-48">
        {/* Input Field */}
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value.toUpperCase());
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Ex: EURUSD"
          className="w-full bg-slate-100 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-10 font-bold uppercase transition-all shadow-sm"
        />

        {/* The "V" (Chevron) Button */}
        <button 
          onClick={toggleDropdown}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-blue-600 cursor-pointer"
          tabIndex={-1} // Prevents tabbing focus
        >
          <svg className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {/* Custom Dropdown List */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in-down">
            {filteredSymbols.length > 0 ? (
              <ul className="py-1 text-sm text-slate-700">
                {filteredSymbols.map((sym) => (
                  <li 
                    key={sym}
                    onClick={() => handleSelect(sym)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors
                      ${sym === currentSymbol ? 'bg-blue-100 text-blue-800' : ''}`}
                  >
                    {sym}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-slate-400 italic text-center">
                No assets found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}