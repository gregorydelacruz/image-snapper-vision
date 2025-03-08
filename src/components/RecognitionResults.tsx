
import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedTransition } from './AnimatedTransition';
import { AnalyzedImage } from '@/hooks/useImageAnalysis';

interface RecognitionResultsProps {
  image: AnalyzedImage;
  onClear: () => void;
  className?: string;
}

export const RecognitionResults: React.FC<RecognitionResultsProps> = ({
  image,
  onClear,
  className,
}) => {
  return (
    <AnimatedTransition
      variant="scale-in"
      className={cn("w-full", className)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-4">
          <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden subtle-shadow">
            <img
              src={image.previewUrl}
              alt="Analyzed"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {image.file.name.length > 25 
                ? `${image.file.name.substring(0, 22)}...` 
                : image.file.name}
              {' '}&middot;{' '}
              {(image.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            
            <button
              onClick={onClear}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Analysis Results</h2>
            <p className="text-muted-foreground text-sm">
              AI-powered image recognition detected the following:
            </p>
          </div>
          
          <div className="space-y-4">
            {image.results.map((result, index) => (
              <AnimatedTransition 
                key={result.label} 
                variant="slide-up" 
                delay={index * 100}
                className="glass-panel p-4 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      index === 0 ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"
                    )}>
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <span className="font-medium tracking-tight">
                      {result.label.charAt(0).toUpperCase() + result.label.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-secondary rounded-full h-2 w-24 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          index === 0 ? "bg-primary" : "bg-secondary-foreground/70"
                        )}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <span className="ml-3 text-sm font-medium">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </AnimatedTransition>
            ))}
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};
