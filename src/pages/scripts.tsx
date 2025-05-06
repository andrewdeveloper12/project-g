// scripts.tsx

export interface NutritionData {
    nutrition: Record<string, string>;
    validation: Record<string, boolean>;
  }
  
  export const uploadImageAndGetData = async (image: File): Promise<NutritionData> => {
    const formData = new FormData();
    formData.append('image', image);
  
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload and analyze the image.');
    }
  
    return await response.json();
  };
  