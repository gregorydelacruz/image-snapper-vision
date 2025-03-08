
import React from 'react';
import { cn } from '@/lib/utils';
import { AnalyzedImage } from '@/hooks/useImageAnalysis';
import { AnimatedTransition } from './AnimatedTransition';

interface ImageHistoryProps {
  images: AnalyzedImage[];
  currentImageId: string | null;
  onSelect: (imageId: string) => void;
  onClear: () => void;
  className?: string;
}

export const ImageHistory: React.FC<ImageHistoryProps> = ({
  images,
  currentImageId,
  onSelect,
  onClear,
  className,
}) => {
  if (images.length === 0) {
    return null;
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <section className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Images</h2>
        <button
          onClick={onClear}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear History
        </button>
      </div>
      
      <div className="flex space-x-4 pb-4 overflow-x-auto hide-scrollbar">
        {images.map((image, index) => (
          <AnimatedTransition
            key={image.id}
            variant="fade-in"
            delay={index * 50}
          >
            <button
              onClick={() => onSelect(image.id)}
              className={cn(
                "relative group",
                "transition-all duration-300 ease-apple transform",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                currentImageId === image.id ? "scale-100" : "hover:scale-105",
                "active:scale-95"
              )}
              title={image.fileName}
            >
              <div 
                className={cn(
                  "w-24 h-24 rounded-xl overflow-hidden border-2",
                  "transition-all duration-300 ease-apple",
                  currentImageId === image.id 
                    ? "border-primary" 
                    : "border-transparent group-hover:border-primary/50"
                )}
              >
                <img
                  src={image.previewUrl}
                  alt={image.fileName || `History ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-1 text-center text-xs text-muted-foreground">
                {formatTime(image.timestamp)}
              </div>
            </button>
          </AnimatedTransition>
        ))}
      </div>
    </section>
  );
};
