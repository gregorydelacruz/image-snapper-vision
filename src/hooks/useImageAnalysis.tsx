
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { recognizeImage, RecognitionResult, createImagePreview, revokeImagePreview } from '@/utils/imageRecognition';

export interface AnalyzedImage {
  id: string;
  file: File;
  fileName: string; // Store the display name separately from the actual file
  previewUrl: string;
  timestamp: Date;
  results: RecognitionResult[];
}

export const useImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<AnalyzedImage | null>(null);
  const [imageHistory, setImageHistory] = useState<AnalyzedImage[]>([]);

  const analyzeImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const previewUrl = createImagePreview(file);
      
      toast.promise(recognizeImage(file), {
        loading: 'Analyzing image...',
        success: (results) => {
          const analyzedImage: AnalyzedImage = {
            id: crypto.randomUUID(),
            file,
            fileName: file.name, // Initialize with original filename
            previewUrl,
            timestamp: new Date(),
            results,
          };
          
          setCurrentImage(analyzedImage);
          setImageHistory((prev) => [analyzedImage, ...prev].slice(0, 10)); // Keep only the last 10 images
          
          return 'Analysis complete';
        },
        error: 'Failed to analyze image',
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('An error occurred while analyzing the image');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearCurrentImage = useCallback(() => {
    if (currentImage) {
      revokeImagePreview(currentImage.previewUrl);
      setCurrentImage(null);
    }
  }, [currentImage]);

  const selectFromHistory = useCallback((imageId: string) => {
    const image = imageHistory.find(img => img.id === imageId);
    if (image) {
      if (currentImage && currentImage.id !== imageId) {
        revokeImagePreview(currentImage.previewUrl);
      }
      
      // Create a fresh preview URL to avoid issues with revoked URLs
      const freshPreviewUrl = createImagePreview(image.file);
      
      setCurrentImage({
        ...image,
        previewUrl: freshPreviewUrl
      });
    }
  }, [currentImage, imageHistory]);

  const clearHistory = useCallback(() => {
    // Revoke all preview URLs
    imageHistory.forEach(img => {
      if (!currentImage || img.id !== currentImage.id) {
        revokeImagePreview(img.previewUrl);
      }
    });
    
    setImageHistory([]);
  }, [currentImage, imageHistory]);

  const renameImage = useCallback((imageId: string, newName: string) => {
    // Update current image if it's the one being renamed
    if (currentImage && currentImage.id === imageId) {
      setCurrentImage(prev => prev ? {
        ...prev,
        fileName: newName
      } : null);
    }
    
    // Update image in history
    setImageHistory(prev => prev.map(img => 
      img.id === imageId ? { ...img, fileName: newName } : img
    ));
  }, [currentImage]);

  return {
    isAnalyzing,
    currentImage,
    imageHistory,
    analyzeImage,
    clearCurrentImage,
    selectFromHistory,
    clearHistory,
    renameImage
  };
};
