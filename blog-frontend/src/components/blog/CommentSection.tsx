import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getCommentsByPostSlug, addComment } from '../../api/comments';
import { useCommentStream } from '../../hooks/useCommentStream';
import { Card } from '../ui/Card';
import { formatDate } from '../../utils';
import { User, Send, MessageSquare } from 'lucide-react';
import { StreamingIndicator } from '../ui/StreamingIndicator';

interface CommentSectionProps {
  slug: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ slug }) => {
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', slug],
    queryFn: () => getCommentsByPostSlug(slug),
  });

  // Enable live updates for comments
  useCommentStream(slug);

  const mutation = useMutation({
    mutationFn: (newComment: { author: string; content: string }) => 
      addComment(slug, newComment),
    onSuccess: () => {
      setContent('');
      setAuthor('');
      // Query will be updated by SSE anyway, but manual invalidate is safer
      queryClient.invalidateQueries({ queryKey: ['comments', slug] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;
    mutation.mutate({ author, content });
  };

  return (
    <div className="space-y-8 mt-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-brand-primary" size={24} />
          <h3 className="text-2xl font-bold">Comments</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-neutral-500 font-mono">
            {comments?.length || 0}
          </span>
        </div>
        <StreamingIndicator active={true} />
      </div>

      <Card className="bg-white/5 border-white/10" hover={false}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-brand-primary focus:outline-none transition-colors text-sm"
              required
            />
          </div>
          <textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-brand-primary focus:outline-none transition-colors min-h-[100px] text-sm"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="glass-button gap-2 text-brand-primary hover:text-white"
            >
              <Send size={16} />
              {mutation.isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {Array.isArray(comments) && comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              layout
            >
              <Card className="bg-white/5 border-white/5 p-4" hover={false}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                      <User size={14} className="text-neutral-400" />
                    </div>
                    <span className="font-medium text-sm">{comment.author}</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed pl-10">
                  {comment.content}
                </p>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        )}
        
        {!isLoading && (!Array.isArray(comments) || comments.length === 0) && (
          <div className="text-center py-10 text-neutral-600 italic">
            No comments yet. Be the first to start the conversation!
          </div>
        )}
      </div>
    </div>
  );
};
