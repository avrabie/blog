import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSSEConnection } from '../api/sse';
import { Comment } from '../types';

export const useCommentStream = (slug: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!slug) return;

    const cleanup = createSSEConnection<Comment>(`/sse/posts/${slug}/comments/stream`, (newComment) => {
      queryClient.setQueryData<Comment[]>(['comments', slug], (oldComments) => {
        if (!oldComments) return [newComment];
        
        // Avoid duplicates
        const commentExists = oldComments.some((c) => c.id === newComment.id);
        if (commentExists) {
            // Update existing
            return oldComments.map(c => c.id === newComment.id ? newComment : c);
        }
        
        // Add new to the end
        return [...oldComments, newComment];
      });
    }, { eventName: 'comment-added' });

    return cleanup;
  }, [queryClient, slug]);
};
