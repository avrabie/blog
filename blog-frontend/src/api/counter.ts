import axios from 'axios';

export const getOnlineCount = async (): Promise<number> => {
  const response = await axios.get<number>(`${import.meta.env.VITE_BACKEND_URL}/api/counter`);
  return response.data;
};
