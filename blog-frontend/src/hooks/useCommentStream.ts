import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSSEConnection } from '../api/sse';
import { Comment } from '../types';

export const useCommentStream = (slug: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!slug) return;

    const cleanup = createSSEConnection<Comment>(`/sse/posts/${slug}/comments/stream`, (newComment) => {
      console.log(`[useCommentStream] Processing new comment for ${slug}:`, newComment);
      queryClient.setQueryData<Comment[]>(['comments', slug], (oldComments) => {
        if (!oldComments) {
            console.log(`[useCommentStream] No old comments found, returning new comment in array.`);
            return [newComment];
        }
        
        // Avoid duplicates
        const commentExists = oldComments.some((c) => String(c.id) === String(newComment.id));
        if (commentExists) {
            console.log(`[useCommentStream] Comment already exists, updating it.`);
            // Update existing
            return oldComments.map(c => String(c.id) === String(newComment.id) ? newComment : c);
        }
        
        console.log(`[useCommentStream] Appending new comment.`);
        // Add new to the end
        return [...oldComments, newComment];
      });
    }, { eventName: 'comment-added' });

    return cleanup;
  }, [queryClient, slug]);
};
