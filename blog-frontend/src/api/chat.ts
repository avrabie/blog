import { apiClient } from './client';
import { Chat, NewChatRequest } from '../types';

export const getChats = async (): Promise<Chat[]> => {
  const response = await apiClient.get<Chat[]>('/chat');
  return response.data;
};

export const sendChat = async (chat: NewChatRequest): Promise<Chat> => {
  const response = await apiClient.post<Chat>('/chat', chat);
  return response.data;
};
