import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getCommentsByPostSlug, addComment, addReply } from '../../api/comments';
import { useCommentStream } from '../../hooks/useCommentStream';
import { Card } from '../ui/Card';
import { formatDate } from '../../utils';
import { User, Send, MessageSquare, Reply, CornerDownRight } from 'lucide-react';
import { StreamingIndicator } from '../ui/StreamingIndicator';
import { Comment } from '../../types';

interface CommentSectionProps {
  slug: string;
}

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

const buildCommentTree = (flatComments: Comment[]): CommentWithReplies[] => {
  const commentMap: Record<string, CommentWithReplies> = {};
  const roots: CommentWithReplies[] = [];

  if (!Array.isArray(flatComments)) return [];

  flatComments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  flatComments.forEach(comment => {
    if (comment.parentId) {
      const parent = commentMap[comment.parentId];
      if (parent) {
        parent.replies.push(commentMap[comment.id]);
      } else {
        roots.push(commentMap[comment.id]);
      }
    } else {
      roots.push(commentMap[comment.id]);
    }
  });

  return roots;
};

interface ReplyFormProps {
  parentId: string | number;
  slug: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ parentId, slug, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const mutation = useMutation({
    mutationFn: (data: { author: string; content: string }) => 
      addReply(String(parentId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', slug] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;
    mutation.mutate({ author, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 focus:border-brand-primary focus:outline-none transition-colors text-xs"
        required
      />
      <textarea
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 focus:border-brand-primary focus:outline-none transition-colors min-h-[80px] text-xs"
        required
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-neutral-500 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="glass-button py-1 px-3 text-xs text-brand-primary hover:text-white"
        >
          {mutation.isPending ? 'Replying...' : 'Reply'}
        </button>
      </div>
    </form>
  );
};

interface CommentItemProps {
  comment: CommentWithReplies;
  slug: string;
  depth?: number;
  replyTo: string | number | null;
  setReplyTo: (id: string | number | null) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, slug, depth = 0, replyTo, setReplyTo }) => {
  return (
    <div className={`space-y-4 ${depth > 0 ? 'ml-10 mt-4' : ''}`}>
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        layout
      >
        <Card className="bg-white/5 border-white/5 p-4" hover={false}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {depth > 0 && <CornerDownRight size={14} className="text-neutral-500" />}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                <User size={14} className="text-neutral-400" />
              </div>
              <span className="font-medium text-sm">{comment.author}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-500 font-mono">
                {formatDate(comment.createdAt)}
              </span>
              <button 
                onClick={() => setReplyTo(String(replyTo) === String(comment.id) ? null : comment.id)}
                className="text-neutral-500 hover:text-brand-primary transition-colors"
              >
                <Reply size={14} />
              </button>
            </div>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed pl-10">
            {comment.content}
          </p>

          <AnimatePresence>
            {String(replyTo) === String(comment.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pl-10 overflow-hidden"
              >
                <ReplyForm 
                  parentId={comment.id}
                  slug={slug}
                  onCancel={() => setReplyTo(null)}
                  onSuccess={() => setReplyTo(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
      
      {comment.replies.map(reply => (
        <CommentItem 
          key={reply.id} 
          comment={reply} 
          slug={slug}
          depth={depth + 1} 
          replyTo={replyTo}
          setReplyTo={setReplyTo}
        />
      ))}
    </div>
  );
};

interface MainCommentFormProps {
  slug: string;
}

const MainCommentForm: React.FC<MainCommentFormProps> = ({ slug }) => {
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const mutation = useMutation({
    mutationFn: (newComment: { author: string; content: string }) => 
      addComment(slug, newComment),
    onSuccess: () => {
      setAuthor('');
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', slug] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;
    mutation.mutate({ author, content });
  };

  return (
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
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ slug }) => {
  const [replyTo, setReplyTo] = useState<string | number | null>(null);

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', slug],
    queryFn: () => getCommentsByPostSlug(slug),
  });

  const commentTree = React.useMemo(() => buildCommentTree(comments || []), [comments]);

  // Enable live updates for comments
  useCommentStream(slug);

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

      <MainCommentForm slug={slug} />

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {commentTree.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              slug={slug}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
            />
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
