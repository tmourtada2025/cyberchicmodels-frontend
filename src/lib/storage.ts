// Google Cloud Storage utility functions
const GCS_BUCKET_URL = import.meta.env.VITE_GCS_BUCKET_URL || 'https://storage.googleapis.com/cyberchicmodels-media';

export function getStorageUrl(bucket: string, path?: string | null): string {
  if (!path) return '';
  
  // If path is already a full URL, return as-is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Construct Google Cloud Storage URL
  return `${GCS_BUCKET_URL}/${bucket}/${path}`;
}

// Alias for backward compatibility
export const publicUrl = getStorageUrl;

export function getModelImageUrl(path: string): string {
  return getStorageUrl('models', path);
}

export function getStyleImageUrl(path: string): string {
  return getStorageUrl('styles', path);
}

export function getHeroImageUrl(path: string): string {
  return getStorageUrl('hero', path);
}

export function getCollectionImageUrl(path: string): string {
  return getStorageUrl('collections', path);
}

// Utility to extract filename from path
export function getFilenameFromPath(path: string): string {
  return path.split('/').pop() || '';
}

// Utility to generate optimized image URLs (for different sizes)
export function getOptimizedImageUrl(path: string, width?: number, height?: number): string {
  if (!path) return '';
  
  const baseUrl = path.startsWith('http') ? path : getStorageUrl('models', path);
  
  // Add image transformation parameters if needed
  if (width || height) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  return baseUrl;
}
