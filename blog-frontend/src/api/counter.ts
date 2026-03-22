import { gatewayClient } from './client';

interface CounterResponse {
  uniqueSessions: number;
}

export const getOnlineCount = async (): Promise<number> => {
  const response = await gatewayClient.get<CounterResponse>('/api/counter');
  return response.data.uniqueSessions;
};
