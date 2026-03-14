import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getPosts } from '../api/posts';
import { PostCard } from '../components/blog/PostCard';
import { usePostStream } from '../hooks/usePostStream';
import { Skeleton } from '../components/ui/Skeleton';
import { StreamingIndicator } from '../components/ui/StreamingIndicator';
import { cn } from '../utils';
import { X } from 'lucide-react';

export const Home: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  // Enable live streaming updates for posts
  usePostStream();

  const allTags = Array.isArray(posts) 
    ? Array.from(new Set(posts.flatMap(p => Array.isArray(p.tags) ? p.tags : []))) 
    : [];

  const filteredPosts = Array.isArray(posts) ? posts.filter(p => 
    !selectedTag || (Array.isArray(p.tags) && p.tags.includes(selectedTag))
  ) : [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12 pb-20">
      <section className="text-center py-20 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <StreamingIndicator active={true} />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter"
        >
          Insights on <span className="gradient-text">Reactive Systems</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Exploring Java, Spring WebFlux, Distributed Systems, and Modern Backend Architecture.
        </motion.p>
      </section>

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-8 border-b border-white/5">
          <button
            onClick={() => setSelectedTag(null)}
            className={cn(
              "glass-button flex items-center gap-1.5",
              !selectedTag ? "bg-brand-primary/20 border-brand-primary/40 text-brand-primary" : "text-neutral-500"
            )}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "glass-button flex items-center gap-1.5",
                selectedTag === tag ? "bg-brand-primary/20 border-brand-primary/40 text-brand-primary" : "text-neutral-500"
              )}
            >
              {tag}
              {selectedTag === tag && <X size={12} />}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-neutral-500">
          Failed to load posts. Is the backend running?
        </div>
      ) : filteredPosts.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.id} variants={item}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 text-neutral-500">
          No posts found.
        </div>
      )}
    </div>
  );
};
