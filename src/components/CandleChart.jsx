import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts'; // 1. Importamos CandlestickSeries

export function CandleChart() {
  const chartContainerRef = useRef();
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null); // Para guardar a referência do gráfico e evitar duplicação

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    // Evita criar dois gráficos em cima do outro (comum no React StrictMode)
    if (chartRef.current) return;

    // 1. Configuração do Gráfico
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' }, // Fundo Slate-900
        textColor: '#94a3b8',
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
    });

    chartRef.current = chart;

    // 2. Adiciona a Série de Candles (MUDANÇA AQUI PARA VERSÃO 5.0)
    // Em vez de chart.addCandlestickSeries(), usamos chart.addSeries(Tipo, Opcoes)
    const newSeries = chart.addSeries(CandlestickSeries, { 
      upColor: '#22c55e', // Emerald-500 (Verde mais bonito)
      downColor: '#ef4444', // Red-500
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // 3. Busca de Dados
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/chart-data`);
        const data = await response.json();
        
        // Verifica se vieram dados antes de plotar
        if (data && data.length > 0) {
          newSeries.setData(data);
          chart.timeScale().fitContent(); // Ajusta o zoom para caber tudo
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar gráfico:", error);
        setLoading(false);
      }
    };

    fetchData();

    // 4. Responsividade
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
      <div ref={chartContainerRef} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-800" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      )}
    </div>
  );
}