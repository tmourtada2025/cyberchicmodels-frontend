// Cache management utilities for the application

/**
 * Clear browser cache using various methods
 */
export class CacheManager {
  /**
   * Clear service worker cache if available
   */
  static async clearServiceWorkerCache(): Promise<void> {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Service worker cache cleared');
      } catch (error) {
        console.warn('Failed to clear service worker cache:', error);
      }
    }
  }

  /**
   * Clear browser storage (localStorage, sessionStorage)
   */
  static clearBrowserStorage(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('Browser storage cleared');
    } catch (error) {
      console.warn('Failed to clear browser storage:', error);
    }
  }

  /**
   * Force reload the page with cache bypass
   */
  static forceReload(): void {
    // Use location.reload(true) if available, otherwise use cache-busting
    if (typeof (window.location as any).reload === 'function') {
      (window.location as any).reload(true);
    } else {
      // Modern browsers - add cache busting parameter
      const url = new URL(window.location.href);
      url.searchParams.set('_cb', Date.now().toString());
      window.location.href = url.toString();
    }
  }

  /**
   * Clear specific domain cookies (if possible)
   */
  static clearDomainCookies(domain?: string): void {
    try {
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Clear for current domain
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        
        // Clear for specified domain if provided
        if (domain) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
        }
      }
      console.log('Domain cookies cleared');
    } catch (error) {
      console.warn('Failed to clear cookies:', error);
    }
  }

  /**
   * Comprehensive cache clear
   */
  static async clearAllCaches(): Promise<void> {
    await Promise.all([
      this.clearServiceWorkerCache(),
      Promise.resolve(this.clearBrowserStorage()),
      Promise.resolve(this.clearDomainCookies())
    ]);
  }

  /**
   * Add no-cache headers to fetch requests
   */
  static addNoCacheHeaders(headers: Record<string, string> = {}): Record<string, string> {
    return {
      ...headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
  }

  /**
   * Create cache-busting URL
   */
  static addCacheBuster(url: string, param: string = '_cb'): string {
    if (!url) return url;
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${param}=${Date.now()}`;
  }

  /**
   * Preload images with cache busting
   */
  static async preloadImagesWithCacheBust(urls: string[]): Promise<void> {
    const promises = urls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load: ${url}`));
        img.src = this.addCacheBuster(url);
      });
    });

    try {
      await Promise.all(promises);
      console.log(`Successfully preloaded ${urls.length} images with cache busting`);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }

  /**
   * Check if running in development mode
   */
  static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development' || 
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  }

  /**
   * Get cache control strategy based on environment
   */
  static getCacheStrategy(): 'aggressive' | 'moderate' | 'minimal' {
    if (this.isDevelopment()) {
      return 'aggressive'; // Always cache bust in development
    }
    
    // Check if user has explicitly requested cache refresh
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('nocache') || urlParams.has('refresh')) {
      return 'aggressive';
    }
    
    return 'moderate';
  }
}

/**
 * Image-specific cache utilities
 */
export class ImageCacheManager {
  private static imageCache = new Map<string, { timestamp: number; blob: Blob }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Cache image blob in memory
   */
  static async cacheImage(url: string): Promise<Blob | null> {
    try {
      const response = await fetch(CacheManager.addCacheBuster(url), {
        headers: CacheManager.addNoCacheHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const blob = await response.blob();
      this.imageCache.set(url, {
        timestamp: Date.now(),
        blob
      });
      
      return blob;
    } catch (error) {
      console.warn('Failed to cache image:', url, error);
      return null;
    }
  }

  /**
   * Get cached image or fetch if not cached/expired
   */
  static async getCachedImage(url: string): Promise<string | null> {
    const cached = this.imageCache.get(url);
    
    if (cached && (Date.now() - cached.timestamp < this.CACHE_DURATION)) {
      return URL.createObjectURL(cached.blob);
    }
    
    // Remove expired cache
    if (cached) {
      this.imageCache.delete(url);
    }
    
    // Fetch and cache new image
    const blob = await this.cacheImage(url);
    return blob ? URL.createObjectURL(blob) : null;
  }

  /**
   * Clear image cache
   */
  static clearImageCache(): void {
    // Revoke all object URLs to prevent memory leaks
    for (const [url, { blob }] of this.imageCache) {
      const objectUrl = URL.createObjectURL(blob);
      URL.revokeObjectURL(objectUrl);
    }
    
    this.imageCache.clear();
    console.log('Image cache cleared');
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; urls: string[] } {
    return {
      size: this.imageCache.size,
      urls: Array.from(this.imageCache.keys())
    };
  }
}

