
import React from 'react';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { RecognitionResults } from '@/components/RecognitionResults';
import { ImageHistory } from '@/components/ImageHistory';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { AnimatedTransition } from '@/components/AnimatedTransition';

const Index = () => {
  const {
    isAnalyzing,
    currentImage,
    imageHistory,
    analyzeImage,
    clearCurrentImage,
    selectFromHistory,
    clearHistory,
    renameImage
  } = useImageAnalysis();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center space-y-8">
          {!currentImage ? (
            <ImageUploader 
              onImageSelected={analyzeImage}
              isAnalyzing={isAnalyzing}
              className="mt-8"
            />
          ) : (
            <RecognitionResults 
              image={currentImage}
              onClear={clearCurrentImage}
              onRename={renameImage}
              className="mt-8"
            />
          )}
          
          <AnimatedTransition 
            variant="fade-in"
            delay={300}
            className="w-full"
            show={imageHistory.length > 0}
          >
            <ImageHistory 
              images={imageHistory}
              currentImageId={currentImage?.id || null}
              onSelect={selectFromHistory}
              onClear={clearHistory}
            />
          </AnimatedTransition>
        </div>
      </main>
      
      <footer className="w-full py-6 border-t border-border/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Vision • AI-powered image recognition
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
