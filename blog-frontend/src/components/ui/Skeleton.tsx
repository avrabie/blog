import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn(
      "animate-pulse bg-neutral-800/50 rounded-md",
      className
    )} />
  );
};
