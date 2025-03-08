
import React from 'react';
import { cn } from '@/lib/utils';

type AnimationVariant = 
  | 'fade-in' 
  | 'slide-up' 
  | 'slide-down' 
  | 'scale-in' 
  | 'blur-in';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  className?: string;
  show?: boolean;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  variant = 'fade-in',
  delay = 0,
  className,
  show = true,
}) => {
  const getDelayClass = () => {
    if (delay === 0) return '';
    if (delay <= 100) return 'animation-delay-100';
    if (delay <= 200) return 'animation-delay-200';
    if (delay <= 300) return 'animation-delay-300';
    if (delay <= 400) return 'animation-delay-400';
    return 'animation-delay-500';
  };

  if (!show) return null;

  return (
    <div
      className={cn(
        `animate-${variant}`,
        getDelayClass(),
        className
      )}
    >
      {children}
    </div>
  );
};
