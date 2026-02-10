import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export function CandleChart({ symbol }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  
  // State to hold data for the tooltip (Open, High, Low, Close)
  const [candleData, setCandleData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    // Prevent double instantiation in React StrictMode
    if (chartRef.current) return;

    // 1. Chart Configuration
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' }, // Slate-900
        textColor: '#cbd5e1',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
      },
    });

    chartRef.current = chart;

    // 2. Add Series (Forex Precision)
    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      priceFormat: {
        type: 'price',
        precision: 5, // 5 decimal places for Forex
        minMove: 0.00001,
      },
    });

    // 3. Mouse/Crosshair Listener for Tooltip
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(newSeries);
        if (data) {
          setCandleData(data);
        }
      }
    });

    // 4. Fetch Data Function
    const fetchData = async () => {
      setLoading(true); // Show loader when switching symbols
      try {
        // Build query string if symbol is provided
        const query = symbol ? `?symbol=${symbol}` : '';
        const response = await fetch(`${API_URL}/chart-data${query}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          newSeries.setData(data);
          chart.timeScale().fitContent();
          
          // Set initial tooltip data to the last candle
          setCandleData(data[data.length - 1]);
        }
      } catch (error) {
        console.error("Chart fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 5. Handle Resize
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol]); // <--- Dependency array: Re-run if 'symbol' changes

  return (
    <div className="w-full h-full relative group p-4">
      
      {/* Floating Tooltip */}
      <div className="absolute top-6 left-6 z-20 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-lg pointer-events-none flex gap-4 text-xs font-mono">
        {!candleData ? (
          <span className="text-slate-400">Loading data...</span>
        ) : (
          <>
            <div className="flex flex-col">
              <span className="text-slate-500 uppercase text-[10px]">Open</span>
              <span className="text-blue-400">{candleData.open?.toFixed(5)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 uppercase text-[10px]">High</span>
              <span className="text-emerald-400">{candleData.high?.toFixed(5)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 uppercase text-[10px]">Low</span>
              <span className="text-rose-400">{candleData.low?.toFixed(5)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 uppercase text-[10px]">Close</span>
              <span className={candleData.close >= candleData.open ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {candleData.close?.toFixed(5)}
              </span>
            </div>
          </>
        )}
      </div>

      <div ref={chartContainerRef} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-800" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      )}
    </div>
  );
}