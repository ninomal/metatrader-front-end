import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export function CandleChart() {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para guardar os dados do candle que o mouse está em cima
  const [candleData, setCandleData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    if (chartRef.current) return;

    // 1. Configuração do Gráfico
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#cbd5e1', // Texto mais claro
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      // Configuração da escala de tempo
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      // Habilita o crosshair (mira)
      crosshair: {
        mode: 1, // CrosshairMode.Normal
      },
    });

    chartRef.current = chart;

    // 2. Adiciona a Série com PRECISÃO DE FOREX (5 casas decimais)
    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      priceFormat: {
        type: 'price',
        precision: 5,     // <--- IMPORTANTE: 5 casas decimais (ex: 1.09345)
        minMove: 0.00001, // <--- Mínimo movimento do preço
      },
    });

    // 3. Listener do Mouse (Tooltip)
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        // Pega os dados do candle onde o mouse está
        const data = param.seriesData.get(newSeries);
        if (data) {
          setCandleData(data);
        }
      } else {
        // Se tirar o mouse, mantém o último ou limpa (opcional)
        // setCandleData(null); 
      }
    });

    // 4. Busca de Dados
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/chart-data`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          newSeries.setData(data);
          chart.timeScale().fitContent();
          
          // Define o valor inicial como o último candle
          setCandleData(data[data.length - 1]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro chart:", error);
        setLoading(false);
      }
    };

    fetchData();

    // 5. Responsividade
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

  return (
    <div className="w-full h-full relative group p-4">
      
      {/* LEGENDA FLUTUANTE (Tooltip) */}
      <div className="absolute top-6 left-6 z-20 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-lg pointer-events-none flex gap-4 text-xs font-mono">
        {!candleData ? (
          <span className="text-slate-400">Carregando dados...</span>
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
            {/* Opcional: Volume */}
            {candleData.tick_volume && (
              <div className="flex flex-col border-l border-slate-600 pl-4">
                <span className="text-slate-500 uppercase text-[10px]">Vol</span>
                <span className="text-yellow-400">{candleData.tick_volume}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* O Gráfico em si */}
      <div ref={chartContainerRef} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-800" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      )}
    </div>
  );
}