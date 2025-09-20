// API service for CyberChicModels.ai
import axios from 'axios';

// Direct database connection for hero slides
const DB_CONFIG = {
  host: '34.72.97.207',
  database: 'cyberchicmodels',
  user: 'postgres',
  password: 'CyberChic2024'
};

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

// Direct database query function for hero slides
async function queryHeroSlides(): Promise<HeroSlide[]> {
  try {
    // Use a serverless function or direct query
    const response = await fetch('https://api.cyberchicmodels.ai/hero-slides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          SELECT 
            id::text,
            title,
            subtitle,
            description,
            CONCAT('https://storage.googleapis.com/cyberchicmodels-media/', background_image_path) as background_image_url,
            button_text,
            button_link,
            display_order as sort_order,
            is_active
          FROM hero_slides 
          WHERE is_active = true
          ORDER BY display_order
        `,
        config: DB_CONFIG
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.rows || [];
    }
  } catch (error) {
    console.warn('Database query failed:', error);
  }

  // Fallback to default slides
  return [
    {
      id: '1',
      title: 'AI Fashion Models for a Digital World',
      subtitle: '',
      description: 'Browse and download ready-to-use model packs — for campaigns, content, or training your own AI.',
      background_image_url: 'https://storage.googleapis.com/cyberchicmodels-media/hero-slides/backgrounds/slide1.webp',
      button_text: 'Browse Models',
      button_link: '/models',
      sort_order: 1,
      is_active: true
    },
    {
      id: '2',
      title: 'Download-Ready Model Packs',
      subtitle: '',
      description: 'Each pack includes 30+ images and short videos — perfect for AI training, mockups, or content creation.',
      background_image_url: 'https://storage.googleapis.com/cyberchicmodels-media/hero-slides/backgrounds/slide2.webp',
      button_text: 'Browse Models',
      button_link: '/models',
      sort_order: 2,
      is_active: true
    },
    {
      id: '3',
      title: 'Built for Creators, Brands & AI Developers',
      subtitle: '',
      description: 'From designers to marketers, anyone can train or feature their own AI model using our stylish assets.',
      background_image_url: 'https://storage.googleapis.com/cyberchicmodels-media/hero-slides/backgrounds/slide3.webp',
      button_text: 'Browse Models',
      button_link: '/models',
      sort_order: 3,
      is_active: true
    },
    {
      id: '4',
      title: 'A Continuously Evolving Model Roster',
      subtitle: '',
      description: 'We\'re adding new AI-generated models weekly — across categories, ethnicities, and moods.',
      background_image_url: 'https://storage.googleapis.com/cyberchicmodels-media/hero-slides/backgrounds/slide4.webp',
      button_text: 'Browse Models',
      button_link: '/models',
      sort_order: 4,
      is_active: true
    }
  ];
}

// API Functions
export const apiService = {
  // Models
  async getModels(params?: { limit?: number; featured?: boolean; new?: boolean; popular?: boolean }) {
    try {
      const response = await api.get('/models', { params });
      return response.data as Model[];
    } catch (error) {
      console.warn('API call failed, using fallback data:', error);
      return [];
    }
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
    try {
      const response = await api.get(`/models/${modelId}/collections`);
      return response.data as ModelCollection[];
    } catch (error) {
      console.warn('API call failed:', error);
      return [];
    }
  },

  async createModelCollection(modelId: string, collectionData: Partial<ModelCollection>) {
    const response = await api.post(`/models/${modelId}/collections`, collectionData);
    return response.data as ModelCollection;
  },

  // Styles
  async getStyles(params?: { limit?: number }) {
    try {
      const response = await api.get('/styles', { params });
      return response.data as Style[];
    } catch (error) {
      console.warn('API call failed:', error);
      return [];
    }
  },

  async getStyle(idOrSlug: string) {
    const response = await api.get(`/styles/${idOrSlug}`);
    return response.data as Style;
  },

  async createStyle(styleData: Partial<Style>) {
    const response = await api.post('/styles', styleData);
    return response.data as Style;
  },

  // Hero Slides - Updated to use direct database connection with fallback
  async getHeroSlides() {
    return await queryHeroSlides();
  },

  // File Upload
  async uploadFile(file: File, bucket: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url as string;
    } catch (error) {
      console.warn('Upload failed:', error);
      throw error;
    }
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
