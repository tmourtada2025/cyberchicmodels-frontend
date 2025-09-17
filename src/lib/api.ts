// API service for CyberChicModels.ai
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` })
  }
});

// Types
export interface Model {
  id: string;
  slug?: string;
  name: string;
  tagline?: string;
  nationality?: string;
  ethnicity?: string;
  gender?: string;
  age?: number;
  height?: string;
  weight?: string;
  bio?: string;
  hobbies?: string;
  specialties?: string[];
  thumbnail_url?: string;
  is_featured?: boolean;
  is_new?: boolean;
  is_popular?: boolean;
  is_coming_soon?: boolean;
  price_usd?: number;
  json_biometric_data?: any;
  created_at?: string;
  updated_at?: string;
}

export interface ModelCollection {
  id: string;
  model_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  images: string[];
  director_style?: string;
  theme?: string;
  created_at?: string;
}

export interface Style {
  id: string;
  slug?: string;
  name: string;
  clothing_type?: string;
  style_theme?: string;
  description?: string;
  price_usd?: number;
  image_url?: string;
  back_image_url?: string;
  colors: string[];
  mannequin_renders?: string[];
  created_at?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  background_image_url?: string;
  button_text: string;
  button_link: string;
  sort_order?: number;
  is_active?: boolean;
}

// API Functions
export const apiService = {
  // Models
  async getModels(params?: { limit?: number; featured?: boolean; new?: boolean; popular?: boolean }) {
    const response = await api.get('/models', { params });
    return response.data as Model[];
  },

  async getModel(idOrSlug: string) {
    const response = await api.get(`/models/${idOrSlug}`);
    return response.data as Model;
  },

  async createModel(modelData: Partial<Model>) {
    const response = await api.post('/models', modelData);
    return response.data as Model;
  },

  async updateModel(id: string, modelData: Partial<Model>) {
    const response = await api.put(`/models/${id}`, modelData);
    return response.data as Model;
  },

  async deleteModel(id: string) {
    await api.delete(`/models/${id}`);
  },

  // Model Collections
  async getModelCollections(modelId: string) {
    const response = await api.get(`/models/${modelId}/collections`);
    return response.data as ModelCollection[];
  },

  async createModelCollection(modelId: string, collectionData: Partial<ModelCollection>) {
    const response = await api.post(`/models/${modelId}/collections`, collectionData);
    return response.data as ModelCollection;
  },

  // Styles
  async getStyles(params?: { limit?: number }) {
    const response = await api.get('/styles', { params });
    return response.data as Style[];
  },

  async getStyle(idOrSlug: string) {
    const response = await api.get(`/styles/${idOrSlug}`);
    return response.data as Style;
  },

  async createStyle(styleData: Partial<Style>) {
    const response = await api.post('/styles', styleData);
    return response.data as Style;
  },

  // Hero Slides
  async getHeroSlides() {
    const response = await api.get('/hero-slides');
    return response.data as HeroSlide[];
  },

  // File Upload
  async uploadFile(file: File, bucket: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url as string;
  },

  // AI Generation
  async generateModel(biometricData: any) {
    const response = await api.post('/ai/generate-model', { biometric_data: biometricData });
    return response.data;
  },

  async generateCollection(modelId: string, directorStyle: string, theme: string) {
    const response = await api.post('/ai/generate-collection', {
      model_id: modelId,
      director_style: directorStyle,
      theme: theme
    });
    return response.data;
  },

  // Trend Analysis
  async analyzeTrends() {
    const response = await api.get('/ai/analyze-trends');
    return response.data;
  },

  // Outfit Extraction
  async extractOutfits(collectionId: string) {
    const response = await api.post(`/ai/extract-outfits/${collectionId}`);
    return response.data;
  }
};

export default apiService;
