
// This is a simulated image recognition service
// In a real app, you would integrate with a real AI service like TensorFlow.js, Hugging Face, or a cloud API

export interface RecognitionResult {
  label: string;
  confidence: number;
}

// Simulated categories for our demo
const possibleLabels = [
  "landscape", "portrait", "animal", "food", "architecture",
  "vehicle", "nature", "technology", "art", "interior",
  "sports", "abstract", "document", "product", "night scene",
  "beach", "mountain", "forest", "city", "people"
];

// This function simulates image analysis
// In a real app, you would replace this with actual AI-based recognition
export const recognizeImage = async (imageFile: File) => {
  return new Promise<RecognitionResult[]>((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Get 3-5 random labels
      const numLabels = Math.floor(Math.random() * 3) + 3;
      const usedIndexes = new Set<number>();
      const results: RecognitionResult[] = [];
      
      // Generate random results
      while (results.length < numLabels) {
        const index = Math.floor(Math.random() * possibleLabels.length);
        if (!usedIndexes.has(index)) {
          usedIndexes.add(index);
          results.push({
            label: possibleLabels[index],
            confidence: Math.random() * 0.5 + 0.5, // Random confidence between 0.5 and 1.0
          });
        }
      }
      
      // Sort by confidence
      results.sort((a, b) => b.confidence - a.confidence);
      
      resolve(results);
    }, 1500); // Simulate a 1.5 second processing time
  });
};

// Generate a descriptive filename based on recognition results
export const generateDescriptiveFilename = (
  originalFilename: string, 
  results: RecognitionResult[]
): string => {
  // Get the file extension
  const extension = originalFilename.split('.').pop() || '';
  
  // Get top 2 labels with highest confidence
  const topLabels = results.slice(0, 2).map(result => result.label);
  
  // Create a descriptive name with labels and timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const descriptiveName = `${topLabels.join('_')}_${timestamp}`;
  
  // Return new filename with original extension
  return `${descriptiveName}.${extension}`;
};

// For creating image preview URLs
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up object URLs to prevent memory leaks
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
