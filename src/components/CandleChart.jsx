import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts';

export function CandleChart({ symbol }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const smaSeriesRef = useRef(null); // Reference for the SMA line

  const [loading, setLoading] = useState(true);
  const [candleData, setCandleData] = useState(null);
  const [showSMA, setShowSMA] = useState(true); // Toggle State for SMA

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  // 1. Initialize Chart (Runs once)
  useEffect(() => {
    if (chartRef.current) return;

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

    // 3. Add SMA Line Series
    const smaSeries = chart.addSeries(LineSeries, {
      color: '#22d3ee', // Cyan-400
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    smaSeriesRef.current = smaSeries;

    // Tooltip Logic
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(newSeries);
        const smaValue = param.seriesData.get(smaSeries);
        if (data) {
          // Merge SMA value into the tooltip data
          setCandleData({ ...data, sma: smaValue?.value });
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

  // 4. Fetch Data (Runs when 'symbol' changes)
  useEffect(() => {
    if (!seriesRef.current || !smaSeriesRef.current) return;

    const fetchData = async () => {
      setLoading(true);
      seriesRef.current.setData([]); 
      smaSeriesRef.current.setData([]);
      setCandleData(null);

      try {
        const query = symbol ? `?symbol=${symbol}` : '';
        // Added cache buster (_t) to ensure fresh data
        const response = await fetch(`${API_URL}/chart-data${query}&_t=${Date.now()}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Set Candlestick Data
          seriesRef.current.setData(data);

          // Filter and Set SMA Data
          const smaData = data
            .filter(d => d.sma !== null && d.sma !== undefined)
            .map(d => ({ time: d.time, value: d.sma }));
          
          smaSeriesRef.current.setData(smaData);

          chartRef.current.timeScale().fitContent();
          setCandleData(data[data.length - 1]);
        }
      } catch (error) {
        console.error("❌ Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // 5. Toggle SMA Visibility
  useEffect(() => {
    if (smaSeriesRef.current) {
      smaSeriesRef.current.applyOptions({
        visible: showSMA,
      });
    }
  }, [showSMA]);

  return (
    <div className="w-full h-full relative group p-4">
      
      {/* Indicator Controls */}
      <div className="absolute top-6 right-6 z-30 flex gap-2">
        <button 
          onClick={() => setShowSMA(!showSMA)}
          className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${
            showSMA 
            ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" 
            : "bg-slate-800 border-slate-700 text-slate-500"
          }`}
        >
          SMA (20) {showSMA ? "ON" : "OFF"}
        </button>
      </div>

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
              <span style={{ color: candleData.color || (candleData.close >= candleData.open ? '#22c55e' : '#ef4444') }} className="font-bold">
                {candleData.close?.toFixed(5)}
              </span>
            </div>
            {showSMA && candleData.sma && (
               <div className="flex flex-col border-l border-slate-600 pl-2">
                <span className="text-cyan-500 uppercase text-[10px]">SMA</span>
                <span className="text-cyan-400">{candleData.sma.toFixed(5)}</span>
              </div>
            )}
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