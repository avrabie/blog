import React from 'react';
import { cn } from '../../utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  className 
}) => {
  const variants = {
    primary: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    secondary: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
    outline: 'bg-transparent text-neutral-400 border-neutral-700',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 text-xs font-medium border rounded-full transition-colors",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
