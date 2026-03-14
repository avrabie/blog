import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSSEConnection } from '../api/sse';
import { Post } from '../types';

export const usePostStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cleanup = createSSEConnection<Post>('/sse/posts/stream', (newPost) => {
      queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
        if (!oldPosts) return [newPost];
        
        // Avoid duplicates
        const postExists = oldPosts.some((p) => p.id === newPost.id);
        if (postExists) {
            // Update existing
            return oldPosts.map(p => p.id === newPost.id ? newPost : p);
        }
        
        // Add new to the beginning
        return [newPost, ...oldPosts];
      });
    }, { eventName: 'post-added' });

    return cleanup;
  }, [queryClient]);
};
