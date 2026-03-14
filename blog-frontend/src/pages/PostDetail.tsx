import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useSpring } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '../api/posts';
import { CommentSection } from '../components/blog/CommentSection';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils';
import { ArrowLeft, Clock, User, Calendar, Copy, Check } from 'lucide-react';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState<string | null>(null);
  
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug!),
    enabled: !!slug,
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-20 space-y-8">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link to="/" className="text-brand-primary hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="py-20 pb-40">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to posts
      </Link>

      <header className="space-y-6 mb-12">
        <div className="flex gap-2">
          {Array.isArray(post.tags) && post.tags.map(tag => (
            <Badge key={tag} variant="primary">{tag}</Badge>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-neutral-400 font-medium italic">
          {post.subtitle}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="text-white font-medium">{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {formatDate(post.createdAt)}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {post.readingTime || 5} min read
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-purple max-w-none prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-white/10 prose-img:rounded-2xl">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              
              if (match) {
                return (
                  <div className="relative group">
                    <button
                      onClick={() => copyToClipboard(codeString)}
                      className="absolute right-4 top-4 p-2 rounded-md bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                    >
                      {copied === codeString ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <pre className={className}>
                      <code className={className} {...props}>{children}</code>
                    </pre>
                  </div>
                );
              }
              return <code className={className} {...props}>{children}</code>;
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <CommentSection slug={post.slug} />
    </article>
  );
};
