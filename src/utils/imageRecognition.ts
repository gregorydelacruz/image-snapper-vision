
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

// Generate a more natural-sounding caption for the image
export const generateImageCaption = (results: RecognitionResult[]): string => {
  // Get top 3 labels (or less if not available)
  const topLabels = results.slice(0, Math.min(3, results.length));
  
  // Different caption templates based on number of labels
  const captionTemplates = [
    // For 1 label
    [
      "A beautiful {0} image",
      "An impressive {0} photograph",
      "This appears to be a {0} scene",
      "A captivating {0} shot",
    ],
    // For 2 labels
    [
      "A {0} with elements of {1}",
      "This image shows {0} and {1}",
      "A {0} scene featuring {1}",
      "This picture combines {0} and {1}",
    ],
    // For 3 labels
    [
      "A {0} image that also features {1} and {2}",
      "This photo captures {0}, {1}, and {2}",
      "A composition of {0}, with elements of {1} and {2}",
      "This image blends {0}, {1}, and {2} elements",
    ]
  ];
  
  // Select appropriate template based on number of labels
  const templateList = captionTemplates[Math.min(topLabels.length, 3) - 1];
  const selectedTemplate = templateList[Math.floor(Math.random() * templateList.length)];
  
  // Fill in the template with actual labels
  let caption = selectedTemplate;
  topLabels.forEach((result, index) => {
    caption = caption.replace(`{${index}}`, result.label);
  });
  
  return caption;
};

// For creating image preview URLs
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up object URLs to prevent memory leaks
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
