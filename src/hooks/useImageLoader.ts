// Custom hook for image loading with cache busting and error handling
import { useState, useEffect, useCallback } from 'react';
import { preloadImage, addCacheBuster, ImageLoadOptions } from '../utils/imageUtils';

export interface UseImageLoaderResult {
  src: string;
  loading: boolean;
  error: string | null;
  retry: () => void;
  forceReload: () => void;
}

export function useImageLoader(
  originalSrc: string,
  options: ImageLoadOptions & { enabled?: boolean } = {}
): UseImageLoaderResult {
  const { enabled = true, cacheBust = true, retryCount = 3, timeout = 10000 } = options;
  
  const [src, setSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState<number>(0);

  const loadImage = useCallback(async (forceReload = false) => {
    if (!originalSrc || !enabled) {
      setSrc('');
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use cache busting for force reload or if cacheBust is enabled
      const shouldCacheBust = forceReload || cacheBust;
      const imageUrl = shouldCacheBust ? addCacheBuster(originalSrc) : originalSrc;
      
      await preloadImage(originalSrc, { 
        cacheBust: shouldCacheBust, 
        retryCount, 
        timeout 
      });
      
      setSrc(imageUrl);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load image';
      setError(errorMessage);
      setSrc(''); // Clear src on error
      console.error('Image loading failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [originalSrc, enabled, cacheBust, retryCount, timeout, loadAttempt]);

  const retry = useCallback(() => {
    setLoadAttempt(prev => prev + 1);
  }, []);

  const forceReload = useCallback(() => {
    setLoadAttempt(prev => prev + 1);
    loadImage(true);
  }, [loadImage]);

  useEffect(() => {
    loadImage();
  }, [loadImage, loadAttempt]);

  return {
    src,
    loading,
    error,
    retry,
    forceReload
  };
}

// Hook specifically for model images with additional features
export function useModelImage(model: { thumbnail_url?: string; cache_buster?: number }) {
  const [imageError, setImageError] = useState<boolean>(false);
  
  const { src, loading, error, retry, forceReload } = useImageLoader(
    model.thumbnail_url || '',
    {
      enabled: !!model.thumbnail_url,
      cacheBust: true,
      retryCount: 3,
      timeout: 15000 // Longer timeout for model images
    }
  );

  // Handle image error state
  useEffect(() => {
    setImageError(!!error);
  }, [error]);

  // Provide fallback image URL if needed
  const finalSrc = src || (model.thumbnail_url && !imageError ? addCacheBuster(model.thumbnail_url, model.cache_buster) : '');

  return {
    src: finalSrc,
    loading,
    error,
    imageError,
    retry,
    forceReload
  };
}

