import { useEffect, useCallback } from 'react';
import { createSSEConnection } from '../api/sse';
import { Chat } from '../types';

export const useChatStream = (
  onNewChat: (chat: Chat) => void,
  onError?: (error: Event) => void
) => {
  const handleNewChat = useCallback((data: unknown) => {
    const chat = data as Chat;
    onNewChat(chat);
  }, [onNewChat]);

  useEffect(() => {
    const cleanup = createSSEConnection<Chat>(
      '/sse/chat/stream',
      handleNewChat,
      {
        eventName: 'chat-added',
        onError,
      }
    );

    return cleanup;
  }, [handleNewChat, onError]);
};
