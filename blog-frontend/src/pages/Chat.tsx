import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { LoginButton } from '../components/auth/LoginButton';
import { getChats, sendChat } from '../api/chat';
import { getOnlineCount } from '../api/counter';
import { useChatStream } from '../hooks/useChatStream';
import { Chat as ChatType } from '../types';
import { UserInfo } from '../types/auth';

interface ChatProps {
  user: UserInfo | null;
}

const MAX_MESSAGE_LENGTH = 4096;

export const Chat: React.FC<ChatProps> = ({ user }) => {
  const [message, setMessage] = useState('');
  const [streamedChats, setStreamedChats] = useState<ChatType[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const { data: initialChats, isLoading } = useQuery<ChatType[]>({
    queryKey: ['chats'],
    queryFn: getChats,
    enabled: !!user,
  });

  const allChats = useMemo(() => {
    return [...(initialChats || []), ...streamedChats.filter(
      s => !(initialChats || []).some(i => i.id === s.id)
    )];
  }, [initialChats, streamedChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allChats]);

  const addChat = async (newChat: ChatType) => {
    setStreamedChats(prev => {
      if (prev.some(c => c.id === newChat.id)) {
        return prev;
      }
      return [...prev, newChat];
    });

    try {
      const count = await getOnlineCount();
      setOnlineCount(count);
    } catch (error) {
      console.log('[Chat] Failed to fetch online count:', error);
    }
  };

  const sendMutation = useMutation({
    mutationFn: sendChat,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      try {
        const count = await getOnlineCount();
        setOnlineCount(count);
      } catch (error) {
        console.log('[Chat] Failed to fetch online count:', error);
      }
    },
  });

  useChatStream(addChat);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || trimmedMessage.length > MAX_MESSAGE_LENGTH || !user) {
      return;
    }

    const username = user?.name || user?.username || 'Anonymous';
    sendMutation.mutate({ author: username, content: trimmedMessage });
    setMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-6 text-center">
        <h2 className="text-2xl font-bold">Login Required</h2>
        <p className="text-neutral-400">Please log in to join the chat.</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col h-[calc(100vh-6rem)]">
      <Card hover={false} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-3 pb-1 border-b border-white/10">
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              {onlineCount} online
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : allChats.length === 0 ? (
            <div className="flex items-center justify-center h-full text-neutral-500">
              No messages yet. Be the first to say something!
            </div>
          ) : (
            allChats.map(chat => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="group px-2 py-1 rounded hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-brand-primary text-sm">{chat.author}: </span>
                <span className="text-neutral-200 text-sm whitespace-pre-wrap break-words">{chat.content}</span>
                <span className="text-xs text-neutral-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatTime(chat.createdAt)}
                </span>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                maxLength={MAX_MESSAGE_LENGTH}
                rows={1}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 focus:outline-none focus:border-brand-primary/50 text-white resize-none transition-colors"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <span className="absolute right-3 bottom-3 text-xs text-neutral-500">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() || message.length > MAX_MESSAGE_LENGTH || sendMutation.isPending}
              className="glass-button bg-brand-primary/20 border-brand-primary/40 text-brand-primary flex items-center gap-2 px-6 disabled:opacity-50"
            >
              {sendMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Send
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
