// Image utility functions for cache busting and error handling

export interface ImageLoadOptions {
  cacheBust?: boolean;
  retryCount?: number;
  timeout?: number;
}

/**
 * Add cache busting parameter to image URL
 */
export function addCacheBuster(url: string, timestamp?: number): string {
  if (!url) return '';
  
  const cacheBuster = timestamp || new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${cacheBuster}`;
}

/**
 * Preload image with cache busting and retry logic
 */
export function preloadImage(url: string, options: ImageLoadOptions = {}): Promise<HTMLImageElement> {
  const { cacheBust = true, retryCount = 3, timeout = 10000 } = options;
  
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const tryLoad = () => {
      attempts++;
      const img = new Image();
      
      // Add cache busting if enabled
      const imageUrl = cacheBust ? addCacheBuster(url) : url;
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        
        if (attempts < retryCount) {
          console.warn(`Image load timeout, retrying (${attempts}/${retryCount}):`, url);
          setTimeout(tryLoad, 1000 * attempts); // Exponential backoff
        } else {
          reject(new Error(`Image load timeout after ${retryCount} attempts: ${url}`));
        }
      }, timeout);
      
      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(img);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        
        if (attempts < retryCount) {
          console.warn(`Image load error, retrying (${attempts}/${retryCount}):`, url);
          setTimeout(tryLoad, 1000 * attempts); // Exponential backoff
        } else {
          reject(new Error(`Image load failed after ${retryCount} attempts: ${url}`));
        }
      };
      
      img.src = imageUrl;
    };
    
    tryLoad();
  });
}

/**
 * Clear browser cache for specific images
 */
export function clearImageCache(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Still resolve to continue with other images
        img.src = addCacheBuster(url);
      });
    })
  );
}

/**
 * Force reload image by clearing cache and reloading
 */
export function forceReloadImage(imgElement: HTMLImageElement): void {
  if (!imgElement.src) return;
  
  const originalSrc = imgElement.src;
  const baseUrl = originalSrc.split('?')[0]; // Remove existing query params
  
  // Clear the src first
  imgElement.src = '';
  
  // Set new src with cache buster after a brief delay
  setTimeout(() => {
    imgElement.src = addCacheBuster(baseUrl);
  }, 100);
}

/**
 * Check if image URL is accessible
 */
export function checkImageAccessibility(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    // Add cache buster to ensure fresh check
    img.src = addCacheBuster(url);
    
    // Timeout after 5 seconds
    setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      resolve(false);
    }, 5000);
  });
}

/**
 * Batch check multiple image URLs
 */
export async function checkMultipleImages(urls: string[]): Promise<{ url: string; accessible: boolean }[]> {
  const results = await Promise.all(
    urls.map(async (url) => ({
      url,
      accessible: await checkImageAccessibility(url)
    }))
  );
  
  return results;
}

