
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
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
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      onImageSelected(file);
    }
  }, [onImageSelected]);
  
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      onImageSelected(file);
    }
  }, [onImageSelected]);

  // Check if API key is set
  const apiKeyMissing = !import.meta.env.VITE_OPENAI_API_KEY;

  return (
    <AnimatedTransition
      variant="scale-in" 
      className={cn("w-full", className)}
    >
      <div className="flex flex-col space-y-6 max-w-lg mx-auto">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">AI Image Analysis</h1>
          <p className="text-muted-foreground">
            Upload an image to analyze its content using GPT-4o vision capabilities
          </p>
        </div>
        
        {apiKeyMissing && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  OpenAI API key not found. The app will use simulated results instead. To use real GPT-4o analysis, add <code className="bg-yellow-100 px-1 py-0.5 rounded">VITE_OPENAI_API_KEY</code> to your environment.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <label
          className={cn(
            "relative flex flex-col items-center justify-center",
            "h-64 border-2 border-dashed rounded-xl",
            "transition-all duration-300 ease-apple cursor-pointer",
            "hover:bg-secondary/20",
            isDragging ? "border-primary bg-primary/5" : "border-border",
            isAnalyzing && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={isAnalyzing}
          />
          
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className={cn(
              "mb-4 w-16 h-16 rounded-full bg-secondary/40 flex items-center justify-center",
              "transition-all duration-300 ease-apple",
              isDragging && "bg-primary/20"
            )}>
              <svg
                className={cn(
                  "w-8 h-8 transition-all",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="mb-2 text-sm font-medium text-foreground">
              {isAnalyzing ? "Analyzing..." : isDragging ? "Drop image here" : "Drop image here or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, GIF up to 10MB
            </p>
          </div>
        </label>
      </div>
    </AnimatedTransition>
  );
};
