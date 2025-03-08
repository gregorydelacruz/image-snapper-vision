
import React, { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedTransition } from './AnimatedTransition';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  isAnalyzing: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isAnalyzing,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isAnalyzing) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  }, [onImageSelected, isAnalyzing]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0]);
    }
  }, [onImageSelected]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <AnimatedTransition 
      variant="scale-in" 
      delay={200} 
      className={cn("w-full", className)}
    >
      <div 
        className={cn(
          "relative w-full h-64 rounded-xl transition-all duration-300 ease-apple",
          "border-2 border-dashed border-border",
          "flex flex-col items-center justify-center text-center p-6",
          "hover:border-primary/50 hover:bg-primary/5",
          "focus-within:border-primary/50 focus-within:bg-primary/5",
          isDragging && "border-primary bg-primary/10",
          isAnalyzing && "opacity-50 cursor-not-allowed",
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />
        
        <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
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
            className={cn(
              "text-primary transition-all duration-300",
              isDragging && "scale-110",
            )}
          >
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            <line x1="16" x2="22" y1="5" y2="5" />
            <line x1="19" x2="19" y1="2" y2="8" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium mb-2">
          {isDragging ? "Drop image here" : "Upload an image"}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          Drag & drop an image, or click to browse
        </p>
        
        <button
          className={cn(
            "px-4 py-2 rounded-lg",
            "bg-primary/10 text-primary",
            "hover:bg-primary/20 active:bg-primary/30",
            "transition-all duration-200 ease-apple",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-sm font-medium",
            isAnalyzing && "opacity-50 cursor-not-allowed",
          )}
          onClick={handleButtonClick}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Select Image"}
        </button>
      </div>
    </AnimatedTransition>
  );
};
