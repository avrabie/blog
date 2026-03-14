import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '../../utils';

interface StreamingIndicatorProps {
  active?: boolean;
  className?: string;
}

export const StreamingIndicator: React.FC<StreamingIndicatorProps> = ({ 
  active = true, 
  className 
}) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
      active 
        ? "bg-green-500/10 text-green-500 border border-green-500/20" 
        : "bg-neutral-500/10 text-neutral-500 border border-neutral-500/20",
      className
    )}>
      <Activity size={12} className={cn(active && "animate-pulse")} />
      {active ? 'Live' : 'Offline'}
    </div>
  );
};
