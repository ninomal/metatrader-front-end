import { useState, useEffect, useCallback } from 'react';
import { botService } from '../services/api';

export function useBotLogic() {
  const [status, setStatus] = useState({ is_running: false, symbol: "---" });
  const [logs, setLogs] = useState(["Sistema iniciado. Aguardando..."]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 6));
  };

  const fetchStatus = useCallback(async () => {
    try {
      const data = await botService.getStatus();
      setStatus(prev => {
        if (prev.is_running !== data.is_running) {
          addLog(`Status alterado: ${data.is_running ? '🟢 RODANDO' : '🔴 PARADO'}`);
        }
        return data;
      });
    } catch (err) {
      // Opcional: tratar erro silencioso de conexão
    }
  }, []);

  // Polling automático
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const toggleBot = async (action) => {
    setLoading(true);
    addLog(`Enviando comando: ${action.toUpperCase()}...`);
    try {
      const res = await botService.sendCommand(action);
      addLog(`✅ Resposta: ${res.message}`);
      await fetchStatus();
    } catch (err) {
      addLog(`❌ Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { status, logs, loading, toggleBot };
}