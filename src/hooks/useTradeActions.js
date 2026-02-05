import { useState } from 'react';
import { tradeApi } from '../services/api';

export function useTradeActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastActionStatus, setLastActionStatus] = useState(null); // To show simple feedback

  const handleActionClick = async (actionName) => {
    setIsLoading(true);
    setLastActionStatus({ type: 'info', message: `Executing ${actionName.toUpperCase()}...` });

    try {
      // mapping button names to hypothetical backend endpoints
      const endpointMap = {
        'Buy': 'buy',
        'Sell': 'sell',
        'Send Telegram': 'telegram_test', // Example endpoint
        'Chart': 'chart_action' // "Charted" changed to "Chart" for clarity
      };

      const endpoint = endpointMap[actionName];
      const result = await tradeApi.executeAction(endpoint);
      
      console.log(`${actionName} result:`, result);
      setLastActionStatus({ type: 'success', message: `Success: ${actionName} executed.` });

    } catch (error) {
      setLastActionStatus({ type: 'error', message: `Failed to execute ${actionName}. Check console.` });
    } finally {
      setIsLoading(false);
      // Clear status message after 3 seconds
      setTimeout(() => setLastActionStatus(null), 3000);
    }
  };

  return {
    isLoading,
    lastActionStatus,
    handleActionClick
  };
}