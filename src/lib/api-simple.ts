// Simple API for testing models
export interface Model {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  nationality: string;
  ethnicity: string;
  gender: string;
  age: number;
  height: string;
  weight: string;
  bio: string;
  hobbies: string;
  specialties: string[];
  thumbnail_url: string;
  is_featured: boolean;
  is_new: boolean;
  is_popular: boolean;
  is_coming_soon: boolean;
  price_usd: number;
}

export const apiService = {
  async getModels() {
    console.log('Loading simple test models...');
    return [
      {
        id: 'av01',
        slug: 'aria-valen',
        name: 'Aria Valen',
        tagline: 'Test Model 1',
        nationality: 'Italian',
        ethnicity: 'Caucasian',
        gender: 'Female',
        age: 27,
        height: '178cm',
        weight: '56kg',
        bio: 'Test model 1',
        hobbies: 'Test hobbies',
        specialties: ['Test specialty'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/av01-aria-valen-thumbnail.webp',
        is_featured: true,
        is_new: false,
        is_popular: false,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'nv01',
        slug: 'nova-vion',
        name: 'Nova Vion',
        tagline: 'Test Model 2',
        nationality: 'American',
        ethnicity: 'Caucasian',
        gender: 'Female',
        age: 24,
        height: '176cm',
        weight: '58kg',
        bio: 'Test model 2',
        hobbies: 'Test hobbies 2',
        specialties: ['Test specialty 2'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/nv01-nova-vion-thumbnail.webp',
        is_featured: false,
        is_new: false,
        is_popular: true,
        is_coming_soon: false,
        price_usd: 99.00
      }
    ];
  }
};
