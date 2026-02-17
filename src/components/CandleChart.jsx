import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export function CandleChart({ symbol }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [candleData, setCandleData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  // 1. Initialize Chart (Runs once)
  useEffect(() => {
    if (chartRef.current) return;

    // Create Chart Instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' }, // Slate-900
        textColor: '#cbd5e1',
      },
      grid: {
        vertLines: { color: '#1e293b' }, // Slate-800
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

    // 2. Add Candlestick Series
    // CRITICAL: We enable borders and wicks but DO NOT set upColor/downColor here.
    // This allows the chart to use the individual colors sent by the Python Backend.
    const newSeries = chart.addSeries(CandlestickSeries, {
      borderVisible: true,
      wickVisible: true,
      priceFormat: {
        type: 'price',
        precision: 5,
        minMove: 0.00001,
      },
    });
    
    seriesRef.current = newSeries;

    // Tooltip Logic
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(newSeries);
        if (data) {
          setCandleData(data);
        }
      }
    });

    // Resize Logic
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

  // 3. Fetch Data (Runs when 'symbol' changes)
  useEffect(() => {
    if (!seriesRef.current) return;

    const fetchData = async () => {
      setLoading(true);
      // Clear data to give visual feedback of loading
      seriesRef.current.setData([]); 
      setCandleData(null);

      try {
        const query = symbol ? `?symbol=${symbol}` : '';
        const response = await fetch(`${API_URL}/chart-data${query}`);
        const data = await response.json();
        
        // DEBUG: Check console to see if colors are arriving
        if (data && data.length > 0) {
          console.log(`📊 Loaded ${data.length} candles for ${symbol}`);
          console.log("🎨 Sample Candle Data:", data[data.length - 1]); 

          seriesRef.current.setData(data);
          chartRef.current.timeScale().fitContent();
          setCandleData(data[data.length - 1]);
        } else {
          console.warn(`⚠️ No data found for symbol: ${symbol}`);
        }
      } catch (error) {
        console.error("❌ Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [symbol]);

  return (
    <div className="w-full h-full relative group p-4">
      
      {/* Floating Tooltip */}
      <div className="absolute top-6 left-6 z-20 bg-slate-800/90 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-lg pointer-events-none flex gap-4 text-xs font-mono min-h-[50px]">
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
              {/* Uses the VSA color if available, otherwise defaults to Green/Red */}
              <span style={{ color: candleData.color || (candleData.close >= candleData.open ? '#22c55e' : '#ef4444') }} className="font-bold">
                {candleData.close?.toFixed(5)}
              </span>
            </div>
             <div className="flex flex-col border-l border-slate-600 pl-2">
              <span className="text-slate-500 uppercase text-[10px]">Vol</span>
              <span className="text-slate-300">{candleData.tick_volume}</span>
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