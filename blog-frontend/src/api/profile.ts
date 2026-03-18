import { bffClient } from './client';

export const getUserProfile = async (): Promise<unknown> => {
  const response = await bffClient.get('/user');
  return response.data;
};
