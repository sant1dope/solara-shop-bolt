'use client';

import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
}

export function Loading({ className }: LoadingProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className={cn("relative flex items-center justify-center min-h-[200px]", className)}>
        {/* Main 'S' letter */}
        <div className="text-6xl font-special text-primary-dark z-10">
          S
        </div>
        
        {/* Orbiting circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Inner orbit */}
          <div className="absolute w-16 h-16 rounded-full border border-primary/20 animate-[spin_3s_linear_infinite]">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full" />
          </div>
          
          {/* Middle orbit */}
          <div className="absolute w-24 h-24 rounded-full border border-primary/20 animate-[spin_5s_linear_infinite]">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary/80 rounded-full" />
          </div>
          
          {/* Outer orbit */}
          <div className="absolute w-32 h-32 rounded-full border border-primary/20 animate-[spin_7s_linear_infinite]">
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary/60 rounded-full" />
          </div>
          
          {/* Far outer orbit */}
          <div className="absolute w-40 h-40 rounded-full border border-primary/20 animate-[spin_9s_linear_infinite]">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary/40 rounded-full" />
          </div>
        </div>
        
      </div>
    </div>
  );
}