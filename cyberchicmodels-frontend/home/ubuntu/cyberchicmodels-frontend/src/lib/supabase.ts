// Legacy Supabase types and exports for backward compatibility
// This file maintains type compatibility while we migrate to the new API

export type Model = {
  id: string | number;
  slug?: string | null;
  name: string;
  tagline?: string | null;
  specialty?: string | null;
  nationality?: string | null;
  ethnicity?: string | null;
  gender?: string | null;
  age?: number | null;
  age_group?: string | null;
  height?: string | null;
  weight?: string | null;
  thumbnail_path?: string | null;
  is_featured?: boolean | null;
  is_new?: boolean | null;
  is_popular?: boolean | null;
  is_coming_soon?: boolean | null;
  bio?: string | null;
  hobbies?: string | null;
  experience_years?: number | null;
  social_media?: any | null;
  measurements?: any | null;
  price_usd?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type Style = {
  id: string;
  slug?: string | null;
  name: string;
  clothing_type?: string | null;
  style_theme?: string | null;
  image_path?: string | null;
  back_image_path?: string | null;
  colors: string[];
  angle?: string | null;
  price_usd?: number | null;
  description?: string | null;
  created_at: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  background_image_path?: string | null;
  button_text: string;
  button_link: string;
  sort_order?: number | null;
  is_active?: boolean | null;
  created_at: string;
  updated_at: string;
};

export type ModelCollection = {
  id: string | number;
  model_id: string | number;
  slug: string;
  title: string;
  cover_path?: string | null;
  sort_order?: number | null;
};

export type ModelPhoto = {
  id: string | number;
  collection_id: string | number;
  storage_path: string;
  caption?: string | null;
  sort_order?: number | null;
};

// Legacy bucket constants
export const BUCKETS = {
  MODELS: "models",
  STYLES: "styles",
  COLLECTIONS: "collections",
  HERO: "hero",
} as const;

// Placeholder supabase object to prevent import errors during migration
export const supabase = {
  from: () => ({
    select: () => ({
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      or: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    })
  }),
  storage: {
    from: () => ({
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      upload: () => Promise.resolve({ data: null, error: null })
    })
  }
};

// Legacy helper functions (now return empty data)
export async function fetchModels(limit = 100) {
  return [] as Model[];
}

export async function fetchModelByIdOrSlug(idOrSlug: string) {
  return null as Model | null;
}

export async function fetchCollectionsForModel(modelId: string | number) {
  return [] as ModelCollection[];
}

export async function fetchPhotosForCollection(collectionId: string | number) {
  return [] as ModelPhoto[];
}
