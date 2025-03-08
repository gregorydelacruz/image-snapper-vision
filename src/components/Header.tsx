
import React from 'react';
import { AnimatedTransition } from './AnimatedTransition';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
        <AnimatedTransition variant="slide-down" delay={100}>
          <div className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Vision</h1>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition variant="fade-in" delay={300} className="mt-6 max-w-xl text-center">
          <p className="text-base text-muted-foreground leading-relaxed text-balance">
            Analyze your images instantly with powerful, state-of-the-art AI recognition technology
          </p>
        </AnimatedTransition>
      </div>
    </header>
  );
};
