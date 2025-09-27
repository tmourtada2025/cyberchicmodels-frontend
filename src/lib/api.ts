// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cyberchic-api-efogygtw5a-uc.a.run.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Model {
  id: string;
  name: string;
  code?: string;
  age?: number;
  nationality?: string;
  ethnicity?: string;
  gender?: string;
  height?: string;
  weight?: string;
  specialty?: string;
  hobbies?: string;
  thumbnail_url: string;
  pack_price: number;
  pack_currency: string;
  is_popular: boolean;
  is_new: boolean;
  is_coming_soon: boolean;
  is_featured: boolean;
  images?: ModelImage[];
}

export interface ModelImage {
  image_url: string;
  image_type: 'thumbnail' | 'gallery' | 'hero';
  sort_order: number;
}

export interface Style {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  price: number;
  currency: string;
}

export interface HeroSlide {
  id: number;
  title?: string;
  subtitle?: string;
  image_url: string;
  sort_order: number;
}

// API functions
export const getModels = async (): Promise<Model[]> => {
  try {
    const response = await api.get('/api/models');
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};

export const getModel = async (id: string): Promise<Model | null> => {
  try {
    const response = await api.get(`/api/models/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching model:', error);
    return null;
  }
};

export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const response = await api.get('/api/hero-slides');
    return response.data;
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
};

export const getStyles = async (): Promise<Style[]> => {
  try {
    const response = await api.get('/api/styles');
    return response.data;
  } catch (error) {
    console.error('Error fetching styles:', error);
    return [];
  }
};

export default api;
