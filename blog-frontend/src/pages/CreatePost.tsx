import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { createPost } from '../api/posts';
import { NewPostRequest } from '../types';
import { ArrowLeft, Send, Eye, Edit3, Tag as TagIcon, Plus, X, Copy, Check } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<NewPostRequest>({
    title: '',
    subtitle: '',
    content: '',
    author: '',
    tags: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Include pending tag if exists
    let finalTags = [...formData.tags];
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !finalTags.includes(trimmedTag)) {
      finalTags.push(trimmedTag);
    }

    const submissionData = {
      ...formData,
      tags: finalTags
    };

    if (!submissionData.title || !submissionData.content || !submissionData.author) {
      alert('Please fill in all required fields (Title, Content, Author)');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createPost(submissionData);
      navigate(`/posts/${result.slug}`);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="py-12 pb-40 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-12">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="glass-button flex items-center gap-2"
          >
            {isPreviewMode ? <Edit3 size={18} /> : <Eye size={18} />}
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="glass-button bg-brand-primary/20 border-brand-primary/40 text-brand-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={18} />
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {isPreviewMode ? 'Previewing' : 'Create'} <span className="gradient-text">New Post</span>
          </h1>
          <p className="text-neutral-500">
            {isPreviewMode ? 'This is how your post will appear to readers.' : 'Share your insights with the community.'}
          </p>
        </div>

        {!isPreviewMode ? (
          <div className="space-y-6">
            <Card hover={false} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Title <span className="text-brand-primary">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling title..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary/50 text-xl font-bold text-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="A short description to hook readers..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary/50 text-neutral-300 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Author <span className="text-brand-primary">*</span></label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Who's writing this?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary/50 text-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Tags</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add tag..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-brand-primary/50 text-white transition-colors"
                      />
                      <TagIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    </div>
                    <button 
                      onClick={addTag}
                      type="button"
                      className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 min-h-[24px]">
                    {formData.tags.map(tag => (
                      <Badge key={tag} className="flex items-center gap-1.5 px-3 py-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Content (Markdown) <span className="text-brand-primary">*</span></label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Tell your story using Markdown syntax..."
                  rows={15}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary/50 font-mono text-sm resize-y text-white transition-colors"
                />
              </div>
            </Card>
          </div>
        ) : (
          <div className="glass-card p-8 md:p-12 rounded-3xl min-h-[600px] border border-white/10">
            <header className="mb-12 space-y-6">
              <div className="flex gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="primary">{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {formData.title || 'Your Post Title'}
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-400 font-medium italic">
                {formData.subtitle || 'Your subtitle will appear here...'}
              </p>

              <div className="flex items-center gap-6 pt-6 border-t border-white/5 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{formData.author || 'Author Name'}</span>
                </div>
                <div>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div>5 min read</div>
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
                {formData.content || '_No content yet. Start writing in Edit Mode!_'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </motion.div>
    </form>
  );
};
