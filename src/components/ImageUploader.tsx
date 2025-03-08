import React, { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AnimatedTransition } from './AnimatedTransition';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Lock } from 'lucide-react';
import { isDevelopment, setApiKey, clearApiKey } from '@/utils/imageRecognition';

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
  const [apiKey, setApiKeyState] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const isDevMode = isDevelopment();
  
  // Check for saved API key on component mount (development only)
  useEffect(() => {
    if (isDevMode) {
      const savedApiKey = localStorage.getItem('openai_api_key');
      if (savedApiKey) {
        setHasApiKey(true);
        // Update the environment variable at runtime
        if (typeof window !== 'undefined') {
          (window as any).VITE_OPENAI_API_KEY = savedApiKey;
        }
      } else {
        setHasApiKey(false);
      }
    } else {
      // In production, check if the environment variable is set
      setHasApiKey(!!import.meta.env.VITE_OPENAI_API_KEY);
    }
  }, [isDevMode]);
  
  const handleApiKeySave = () => {
    if (!isDevMode) {
      toast.error('API key changes are only allowed in development mode');
      return;
    }
    
    if (apiKey.trim().length > 0) {
      setApiKey(apiKey);
      setHasApiKey(true);
      setShowApiKeyInput(false);
      toast.success('API key saved for this session');
    } else {
      toast.error('Please enter a valid API key');
    }
  };
  
  const handleClearApiKey = () => {
    if (!isDevMode) {
      toast.error('API key changes are only allowed in development mode');
      return;
    }
    
    clearApiKey();
    setHasApiKey(false);
    setApiKeyState('');
    toast.success('API key removed');
  };
  
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

  // Check if API key is set from environment
  const apiKeyMissing = !hasApiKey;
  const apiKeyMessage = isDevMode 
    ? "OpenAI API key not found. The app will use simulated results instead."
    : "OpenAI API key not configured in production environment.";

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
        
        {apiKeyMissing ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {apiKeyMessage}
                  {!showApiKeyInput && isDevMode ? (
                    <button 
                      onClick={() => setShowApiKeyInput(true)}
                      className="ml-2 underline text-blue-600 hover:text-blue-800"
                    >
                      Add your API key
                    </button>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    API key is set. Using GPT-4o for image analysis.
                  </p>
                </div>
              </div>
              {isDevMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearApiKey}
                  className="text-xs"
                >
                  Remove Key
                </Button>
              )}
            </div>
          </div>
        )}
        
        {showApiKeyInput && isDevMode && (
          <div className="flex flex-col space-y-2 p-4 border rounded-md bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">
              Enter your OpenAI API key. It will be stored locally on your device only.
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleApiKeySave}>Save</Button>
              <Button variant="outline" onClick={() => setShowApiKeyInput(false)}>Cancel</Button>
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
