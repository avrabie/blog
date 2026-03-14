import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSSEConnection } from '../api/sse';
import { Post } from '../types';

export const usePostStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cleanup = createSSEConnection<Post>('/sse/posts/stream', (newPost) => {
      console.log('[usePostStream] Processing new post:', newPost);
      queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
        if (!oldPosts) {
            console.log('[usePostStream] No old posts found, returning new post in array.');
            return [newPost];
        }
        
        // Avoid duplicates
        const postExists = oldPosts.some((p) => String(p.id) === String(newPost.id));
        if (postExists) {
            console.log('[usePostStream] Post already exists, updating it.');
            // Update existing
            return oldPosts.map(p => String(p.id) === String(newPost.id) ? newPost : p);
        }
        
        console.log('[usePostStream] Prepending new post.');
        // Add new to the beginning
        return [newPost, ...oldPosts];
      });
    }, { eventName: 'post-added' });

    return cleanup;
  }, [queryClient]);
};
