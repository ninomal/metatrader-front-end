import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export function CandleChart({ symbol }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null); // Reference to the series to update data later
  const [loading, setLoading] = useState(true);
  
  // State for the floating tooltip (OHLC data)
  const [candleData, setCandleData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  // 1. Initialize Chart (Runs only once on mount)
  useEffect(() => {
    if (chartRef.current) return;

    // Create the chart instance
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

    // Add the Candlestick Series
    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      priceFormat: {
        type: 'price',
        precision: 5, // Forex precision (e.g., 1.09345)
        minMove: 0.00001,
      },
    });
    
    seriesRef.current = newSeries; // Store reference for the second useEffect

    // Subscribe to crosshair movement for the tooltip
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(newSeries);
        if (data) {
          setCandleData(data);
        }
      }
    });

    // Handle Window Resize
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // 2. Fetch Data (Runs every time 'symbol' changes)
  useEffect(() => {
    if (!seriesRef.current) return;

    const fetchData = async () => {
      setLoading(true);
      
      // Clear old data immediately to show loading state visually
      seriesRef.current.setData([]); 
      setCandleData(null);

      try {
        const query = symbol ? `?symbol=${symbol}` : '';
        const response = await fetch(`${API_URL}/chart-data${query}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          seriesRef.current.setData(data);
          chartRef.current.timeScale().fitContent(); // Auto-zoom to data
          
          // Set initial tooltip to the last candle
          setCandleData(data[data.length - 1]);
        } else {
          console.warn(`No data found for symbol: ${symbol}`);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [symbol]); // <--- Dependency: Re-run this effect when 'symbol' prop changes

  return (
    <div className="w-full h-full relative group p-4">
      
      {/* Floating Tooltip (OHLC) */}
      <div className="absolute top-6 left-6 z-20 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-lg pointer-events-none flex gap-4 text-xs font-mono min-h-[50px]">
        {!candleData ? (
          <span className="text-slate-400 my-auto">{loading ? `Loading ${symbol}...` : "No Data"}</span>
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

      {/* Chart Container */}
      <div ref={chartContainerRef} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-800" />
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10 backdrop-blur-[1px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      )}
    </div>
  );
}