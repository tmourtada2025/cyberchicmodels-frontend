// Reusable image component with fallback and cache busting
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useImageLoader } from '../hooks/useImageLoader';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  showRetryButton?: boolean;
  retryButtonClassName?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  cacheBust?: boolean;
  retryCount?: number;
  timeout?: number;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  showRetryButton = true,
  retryButtonClassName = '',
  onLoad,
  onError,
  cacheBust = true,
  retryCount = 3,
  timeout = 10000
}: ImageWithFallbackProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { 
    src: imageSrc, 
    loading, 
    error, 
    retry, 
    forceReload 
  } = useImageLoader(src, {
    enabled: !!src,
    cacheBust,
    retryCount,
    timeout
  });

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  const handleImageLoad = () => {
    setHasLoaded(true);
    onLoad?.();
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setHasLoaded(false);
    retry();
  };

  const handleForceReload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setHasLoaded(false);
    forceReload();
  };

  if (loading) {
    return (
      <div className={`${className} ${fallbackClassName} bg-gray-200 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className={`${className} ${fallbackClassName} bg-gray-100 flex flex-col items-center justify-center text-gray-500`}>
        <div className="text-center p-4">
          <p className="text-sm mb-2">Image failed to load</p>
          {showRetryButton && (
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className={`inline-flex items-center px-3 py-1 bg-rose-500 text-white text-xs rounded hover:bg-rose-600 transition-colors ${retryButtonClassName}`}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </button>
              <button
                onClick={handleForceReload}
                className={`inline-flex items-center px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors ${retryButtonClassName}`}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Force Reload
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      onLoad={handleImageLoad}
      onError={() => {
        console.error('Image failed to load:', imageSrc);
      }}
      style={{
        opacity: hasLoaded ? 1 : 0.8,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
}

// Specialized component for model images
interface ModelImageProps extends Omit<ImageWithFallbackProps, 'src'> {
  model: {
    thumbnail_url?: string;
    cache_buster?: number;
    name: string;
  };
}

export function ModelImage({ model, alt, ...props }: ModelImageProps) {
  return (
    <ImageWithFallback
      src={model.thumbnail_url || ''}
      alt={alt || model.name}
      {...props}
    />
  );
}

