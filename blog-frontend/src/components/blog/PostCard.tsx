import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../utils';
import { Clock, User, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link to={`/posts/${post.slug}`}>
      <Card className="flex flex-col h-full group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 flex-wrap">
            {Array.isArray(post.tags) && post.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <span className="text-xs text-neutral-500 font-mono">{formatDate(post.createdAt)}</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 group-hover:text-brand-primary transition-colors">
          {post.title}
        </h2>
        
        <p className="text-neutral-400 text-sm mb-6 flex-grow">
          {post.subtitle}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <User size={14} />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readingTime || 5} min read
            </span>
          </div>
          
          <div className="text-brand-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            <ArrowRight size={18} />
          </div>
        </div>
      </Card>
    </Link>
  );
};
