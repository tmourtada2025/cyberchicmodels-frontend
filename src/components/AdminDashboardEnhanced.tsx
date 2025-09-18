import React, { useState, useEffect } from 'react';
import { Users, Palette, Image, BarChart3, Bot, Settings, Plus, DoorOpen, Home, X, Upload } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

// API service for backend communication
const API_BASE_URL = 'https://cyberchicmodels-api-719300876829.us-central1.run.app';

const apiService = {
  async getModels() {
    const response = await fetch(`${API_BASE_URL}/api/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch models');
    return response.json();
  },

  async createModel(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create model');
    return response.json();
  },

  async getStyles() {
    const response = await fetch(`${API_BASE_URL}/api/styles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch styles');
    return response.json();
  },

  async createStyle(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/styles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create style');
    return response.json();
  },

  async getHeroSlides() {
    const response = await fetch(`${API_BASE_URL}/api/hero-slides`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch hero slides');
    return response.json();
  },

  async createHeroSlide(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/hero-slides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create hero slide');
    return response.json();
  }
};

export function AdminDashboardEnhanced({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [models, setModels] = useState<any[]>([]);
  const [styles, setStyles] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal states
  const [showAddModel, setShowAddModel] = useState(false);
  const [showAddStyle, setShowAddStyle] = useState(false);
  const [showAddSlide, setShowAddSlide] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load data from backend
      const [modelsData, stylesData, slidesData] = await Promise.allSettled([
        apiService.getModels(),
        apiService.getStyles(),
        apiService.getHeroSlides()
      ]);
      
      setModels(modelsData.status === 'fulfilled' ? modelsData.value : []);
      setStyles(stylesData.status === 'fulfilled' ? stylesData.value : []);
      setHeroSlides(slidesData.status === 'fulfilled' ? slidesData.value : []);
      
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Backend connection failed. Working in offline mode.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
    setTimeout(() => setSuccess(null), 5000);
  };

  const showError = (message: string) => {
    setError(message);
    setSuccess(null);
    setTimeout(() => setError(null), 8000);
  };

  const handleExitAdmin = () => {
    if (window.confirm('Are you sure you want to exit the admin panel?')) {
      onLogout();
    }
  };

  // Add Model Modal Component
  const AddModelModal = () => {
    const [modelImages, setModelImages] = useState<{file: File, type: string}[]>([]);
    const [modelCollections, setModelCollections] = useState<string[]>([]);
    const [newCollection, setNewCollection] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const imageTypes = [
      'thumbnail', 'headshot', 'three_quarter', 'full_body', 
      'profile', 'back_view', 'detail_shot', 'lifestyle'
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newImages = files.map(file => ({ file, type: 'thumbnail' }));
      setModelImages(prev => [...prev, ...newImages]);
    };

    const updateImageType = (index: number, type: string) => {
      setModelImages(prev => prev.map((img, i) => 
        i === index ? { ...img, type } : img
      ));
    };

    const removeImage = (index: number) => {
      setModelImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddCollection = () => {
      if (newCollection.trim() && !modelCollections.includes(newCollection.trim())) {
        setModelCollections(prev => [...prev, newCollection.trim()]);
        setNewCollection('');
      }
    };

    const removeCollection = (collection: string) => {
      setModelCollections(prev => prev.filter(c => c !== collection));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const formData = new FormData(e.target as HTMLFormElement);
        
        const modelData = {
          name: formData.get('name') as string,
          tagline: formData.get('tagline') as string,
          nationality: formData.get('nationality') as string,
          ethnicity: formData.get('ethnicity') as string,
          gender: formData.get('gender') as string,
          age: parseInt(formData.get('age') as string) || null,
          height: formData.get('height') as string,
          weight: formData.get('weight') as string,
          bio: formData.get('bio') as string,
          hobbies: formData.get('hobbies') as string,
          specialties: (formData.get('specialties') as string)?.split(',').map(s => s.trim()).filter(s => s) || [],
          price_usd: parseFloat(formData.get('price') as string) || 1.99,
          is_featured: formData.get('featured') === 'on',
          is_new: formData.get('new') === 'on',
          is_coming: formData.get('coming') === 'on',
          is_popular: formData.get('popular') === 'on',
          status: 'published',
          collections: modelCollections,
          image_count: modelImages.length
        };

        console.log('Creating model with data:', modelData);
        
        // Try to create model via API
        await apiService.createModel(modelData);
        
        showSuccess(`✅ Model "${modelData.name}" created successfully with ${modelCollections.length} collections and ${modelImages.length} images!`);
        
        // Reset form
        setModelImages([]);
        setModelCollections([]);
        setNewCollection('');
        
        // Refresh data and close modal
        loadData();
        setShowAddModel(false);
        
      } catch (err) {
        console.error('Model creation error:', err);
        showError(`❌ Failed to create model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Add New Model</h3>
            <button 
              onClick={() => setShowAddModel(false)} 
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Name *</label>
                  <input 
                    name="name" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Sophia Martinez" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input 
                    name="tagline" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Fashion Forward" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input 
                    name="nationality" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Spanish" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                  <input 
                    name="ethnicity" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Hispanic" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select 
                    name="gender" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input 
                    name="age" 
                    type="number" 
                    min="18" 
                    max="65" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="25" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input 
                    name="height" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., 5ft 7in" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input 
                    name="weight" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., 125 lbs" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                  <input 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    min="0.99" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="1.99" 
                    defaultValue="1.99"
                  />
                </div>
              </div>
            </div>

            {/* Bio and Details */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Bio & Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea 
                    name="bio" 
                    rows={4} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="Professional fashion model with experience in..."
                  ></textarea>
                </div>
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
                    <textarea 
                      name="hobbies" 
                      rows={2} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                      placeholder="Photography, yoga, traveling..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                    <input 
                      name="specialties" 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                      placeholder="fashion, commercial, editorial" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Model Flags */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Model Flags</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="featured" type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">⭐ Featured</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="new" type="checkbox" defaultChecked className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">🆕 New</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="coming" type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">🔜 Coming Soon</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="popular" type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">🔥 Popular</span>
                </label>
              </div>
            </div>

            {/* Collections */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Collections</h4>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter collection name (e.g., Summer 2024, Casual Wear)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCollection();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCollection}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Add Collection
                </button>
              </div>
              {modelCollections.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {modelCollections.map((collection, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {collection}
                      <button
                        type="button"
                        onClick={() => removeCollection(collection)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Model Images</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="model-image-upload"
                />
                <label htmlFor="model-image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Upload Model Images</p>
                  <p className="text-sm text-gray-500">Click to select or drag and drop images</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB each</p>
                </label>
              </div>
              
              {modelImages.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelImages.map((imageData, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={URL.createObjectURL(imageData.file)}
                          alt={`Upload ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-2">{imageData.file.name}</p>
                          <select
                            value={imageData.type}
                            onChange={(e) => updateImageType(index, e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            {imageTypes.map(type => (
                              <option key={type} value={type}>
                                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button 
                type="button" 
                onClick={() => setShowAddModel(false)} 
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Model...
                  </>
                ) : (
                  'Create Model'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add Style Modal Component
  const AddStyleModal = () => {
    const [styleImages, setStyleImages] = useState<{file: File, type: string, description: string}[]>([]);
    const [colors, setColors] = useState<string[]>(['#ff0000']);
    const [submitting, setSubmitting] = useState(false);

    const styleImageTypes = [
      'front_view', 'back_view', 'side_view', 'detail_shot', 
      'texture_closeup', 'worn_model', 'flat_lay', 'lifestyle'
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newImages = files.map(file => ({ 
        file, 
        type: 'front_view', 
        description: '' 
      }));
      setStyleImages(prev => [...prev, ...newImages]);
    };

    const updateImageType = (index: number, type: string) => {
      setStyleImages(prev => prev.map((img, i) => 
        i === index ? { ...img, type } : img
      ));
    };

    const updateImageDescription = (index: number, description: string) => {
      setStyleImages(prev => prev.map((img, i) => 
        i === index ? { ...img, description } : img
      ));
    };

    const removeImage = (index: number) => {
      setStyleImages(prev => prev.filter((_, i) => i !== index));
    };

    const addColor = () => {
      setColors(prev => [...prev, '#ff0000']);
    };

    const updateColor = (index: number, color: string) => {
      setColors(prev => prev.map((c, i) => i === index ? color : c));
    };

    const removeColor = (index: number) => {
      if (colors.length > 1) {
        setColors(prev => prev.filter((_, i) => i !== index));
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const formData = new FormData(e.target as HTMLFormElement);
        
        const styleData = {
          name: formData.get('name') as string,
          clothing_type: formData.get('clothing_type') as string,
          category: formData.get('category') as string,
          description: formData.get('description') as string,
          material: formData.get('material') as string,
          brand: formData.get('brand') as string,
          season: formData.get('season') as string,
          price_usd: parseFloat(formData.get('price') as string) || 1.99,
          colors: colors,
          is_featured: formData.get('featured') === 'on',
          is_new: formData.get('new') === 'on',
          is_bestseller: formData.get('bestseller') === 'on',
          status: 'published',
          image_count: styleImages.length
        };

        console.log('Creating style with data:', styleData);
        
        await apiService.createStyle(styleData);
        
        showSuccess(`✅ Style "${styleData.name}" created successfully with ${colors.length} colors and ${styleImages.length} images!`);
        
        // Reset form
        setStyleImages([]);
        setColors(['#ff0000']);
        
        // Refresh data and close modal
        loadData();
        setShowAddStyle(false);
        
      } catch (err) {
        console.error('Style creation error:', err);
        showError(`❌ Failed to create style: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Add New Style</h3>
            <button 
              onClick={() => setShowAddStyle(false)} 
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style Name *</label>
                  <input 
                    name="name" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Elegant Evening Dress" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clothing Type</label>
                  <select 
                    name="clothing_type" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Select type</option>
                    <option value="dress">Dress</option>
                    <option value="top">Top</option>
                    <option value="blouse">Blouse</option>
                    <option value="shirt">Shirt</option>
                    <option value="bottom">Bottom</option>
                    <option value="pants">Pants</option>
                    <option value="skirt">Skirt</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="jacket">Jacket</option>
                    <option value="coat">Coat</option>
                    <option value="accessories">Accessories</option>
                    <option value="shoes">Shoes</option>
                    <option value="bag">Bag</option>
                    <option value="jewelry">Jewelry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    name="category" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Select category</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="business">Business</option>
                    <option value="party">Party</option>
                    <option value="evening">Evening</option>
                    <option value="beach">Beach</option>
                    <option value="sports">Sports</option>
                    <option value="vintage">Vintage</option>
                    <option value="bohemian">Bohemian</option>
                    <option value="minimalist">Minimalist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input 
                    name="brand" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Chanel, Zara" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input 
                    name="material" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Cotton, Silk, Polyester" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                  <select 
                    name="season" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Select season</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                    <option value="all-season">All Season</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                  <input 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    min="0.99" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="1.99" 
                    defaultValue="1.99"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Description</h4>
              <textarea 
                name="description" 
                rows={4} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                placeholder="Describe this style, its features, and styling suggestions..."
              ></textarea>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Available Colors</h4>
              <div className="flex flex-wrap gap-4 mb-4">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={colors.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addColor}
                  className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-rose-400 hover:text-rose-500"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Style Flags */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Style Flags</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="featured" type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">⭐ Featured</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="new" type="checkbox" defaultChecked className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">🆕 New</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="bestseller" type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">🏆 Bestseller</span>
                </label>
              </div>
            </div>

            {/* Image Upload with Angle Selection */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Style Images with Angles</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="style-image-upload"
                />
                <label htmlFor="style-image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Upload Style Images</p>
                  <p className="text-sm text-gray-500">Front view, back view, side view, detail shots</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB each</p>
                </label>
              </div>
              
              {styleImages.length > 0 && (
                <div className="mt-4 space-y-4">
                  {styleImages.map((imageData, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={URL.createObjectURL(imageData.file)}
                          alt={`Style ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-3">
                          <p className="text-sm font-medium text-gray-900">{imageData.file.name}</p>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Image Type/Angle</label>
                            <select
                              value={imageData.type}
                              onChange={(e) => updateImageType(index, e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-3 py-2"
                            >
                              {styleImageTypes.map(type => (
                                <option key={type} value={type}>
                                  {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                            <input
                              type="text"
                              value={imageData.description}
                              onChange={(e) => updateImageDescription(index, e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-3 py-2"
                              placeholder="Describe this image..."
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button 
                type="button" 
                onClick={() => setShowAddStyle(false)} 
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Style...
                  </>
                ) : (
                  'Create Style'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add Hero Slide Modal Component
  const AddSlideModal = () => {
    const [heroImages, setHeroImages] = useState<{file: File, order: number}[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newImages = files.map((file, index) => ({ 
        file, 
        order: heroImages.length + index + 1 
      }));
      setHeroImages(prev => [...prev, ...newImages]);
    };

    const updateImageOrder = (index: number, order: number) => {
      setHeroImages(prev => prev.map((img, i) => 
        i === index ? { ...img, order } : img
      ));
    };

    const removeImage = (index: number) => {
      setHeroImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const formData = new FormData(e.target as HTMLFormElement);
        
        const slideData = {
          title: formData.get('title') as string,
          subtitle: formData.get('subtitle') as string,
          button_text: formData.get('button_text') as string,
          button_link: formData.get('button_link') as string,
          description: formData.get('description') as string,
          background_color: formData.get('background_color') as string,
          text_color: formData.get('text_color') as string,
          display_order: parseInt(formData.get('display_order') as string) || 1,
          is_active: formData.get('active') === 'on',
          is_featured: formData.get('featured') === 'on',
          animation_type: formData.get('animation_type') as string,
          duration_seconds: parseInt(formData.get('duration_seconds') as string) || 5,
          image_count: heroImages.length
        };

        console.log('Creating hero slide with data:', slideData);
        
        await apiService.createHeroSlide(slideData);
        
        showSuccess(`✅ Hero slide "${slideData.title}" created successfully at carousel position ${slideData.display_order} with ${heroImages.length} images!`);
        
        // Reset form
        setHeroImages([]);
        
        // Refresh data and close modal
        loadData();
        setShowAddSlide(false);
        
      } catch (err) {
        console.error('Hero slide creation error:', err);
        showError(`❌ Failed to create hero slide: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Add New Hero Slide</h3>
            <button 
              onClick={() => setShowAddSlide(false)} 
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Slide Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input 
                    name="title" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Discover Your Style" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input 
                    name="subtitle" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Explore our latest collection" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input 
                    name="button_text" 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="e.g., Shop Now" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input 
                    name="button_link" 
                    type="url" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="https://..." 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    rows={3} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="Describe this slide and its purpose..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Visual Settings */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Visual Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <input 
                    name="background_color" 
                    type="color" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-12 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    defaultValue="#667eea"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <input 
                    name="text_color" 
                    type="color" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-12 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    defaultValue="#ffffff"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Animation Type</label>
                  <select 
                    name="animation_type" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="fade">Fade In</option>
                    <option value="slide-left">Slide from Left</option>
                    <option value="slide-right">Slide from Right</option>
                    <option value="slide-up">Slide from Bottom</option>
                    <option value="zoom">Zoom In</option>
                    <option value="none">No Animation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Carousel Settings */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Carousel Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order (1-10)</label>
                  <input 
                    name="display_order" 
                    type="number" 
                    min="1" 
                    max="10" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="1" 
                    defaultValue="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                  <input 
                    name="duration_seconds" 
                    type="number" 
                    min="3" 
                    max="15" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                    placeholder="5" 
                    defaultValue="5"
                  />
                </div>
              </div>
            </div>

            {/* Slide Flags */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Slide Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="active" type="checkbox" defaultChecked className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">✅ Active (Show in carousel)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input name="featured" type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-sm font-medium">⭐ Featured (Priority display)</span>
                </label>
              </div>
            </div>

            {/* Image Upload with Order */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Background Images with Carousel Order</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="hero-image-upload"
                />
                <label htmlFor="hero-image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Upload Background Images</p>
                  <p className="text-sm text-gray-500">High-resolution images for carousel background</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB each</p>
                </label>
              </div>
              
              {heroImages.length > 0 && (
                <div className="mt-4 space-y-4">
                  {heroImages.map((imageData, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={URL.createObjectURL(imageData.file)}
                          alt={`Background ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-3">
                          <p className="text-sm font-medium text-gray-900">{imageData.file.name}</p>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Display Order in Carousel</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={imageData.order}
                              onChange={(e) => updateImageOrder(index, parseInt(e.target.value) || 1)}
                              className="w-20 text-sm border border-gray-300 rounded px-3 py-2"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button 
                type="button" 
                onClick={() => setShowAddSlide(false)} 
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Slide...
                  </>
                ) : (
                  'Create Hero Slide'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderModelsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Models Management</h2>
        <button 
          onClick={() => setShowAddModel(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Model
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No models found</p>
          <p className="text-sm text-gray-500">Models will appear here once created or when backend is connected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <div key={model.id || index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">{model.name}</h3>
              <p className="text-gray-600">{model.nationality}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {model.is_featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ Featured</span>}
                {model.is_new && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">🆕 New</span>}
                {model.is_coming && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">🔜 Coming</span>}
                {model.is_popular && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">🔥 Popular</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStylesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Styles Management</h2>
        <button 
          onClick={() => setShowAddStyle(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Style
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      ) : styles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No styles found</p>
          <p className="text-sm text-gray-500">Styles will appear here once created or when backend is connected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map((style, index) => (
            <div key={style.id || index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">{style.name}</h3>
              <p className="text-gray-600">${style.price_usd}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHeroSlidesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hero Slides Management</h2>
        <button 
          onClick={() => setShowAddSlide(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Slide
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      ) : heroSlides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No hero slides found</p>
          <p className="text-sm text-gray-500">Hero slides will appear here once created or when backend is connected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroSlides.map((slide, index) => (
            <div key={slide.id || index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">{slide.title}</h3>
              <p className="text-gray-600">{slide.subtitle}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Base URL</label>
            <input 
              type="text" 
              value={API_BASE_URL}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Cloud Storage URL</label>
            <input 
              type="text" 
              value="https://storage.googleapis.com/cyberchicmodels-media"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              readOnly
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Environment variables are configured in your deployment settings.</p>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Connection Status</h4>
          <p className="text-sm text-blue-700">
            {error ? '🔴 Backend connection failed - Working in offline mode' : '🟢 Backend connection successful'}
          </p>
        </div>
      </div>
    </div>
   );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Exit Door - NO KEY ICON */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">CyberChicModels.ai</h1>
              <span className="text-sm text-gray-500">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Site
              </button>
              <button 
                onClick={handleExitAdmin}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <DoorOpen className="w-4 h-4 mr-2" />
                Exit Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            ⚠️ {error}
          </div>
        </div>
      )}
      
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-6">
            <button
              onClick={() => setActiveTab('models')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'models' ? 'bg-rose-50 border-r-2 border-rose-500 text-rose-600' : 'text-gray-600'
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              Models
            </button>
            
            <button
              onClick={() => setActiveTab('styles')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'styles' ? 'bg-rose-50 border-r-2 border-rose-500 text-rose-600' : 'text-gray-600'
              }`}
            >
              <Palette className="w-5 h-5 mr-3" />
              Styles
            </button>
            
            <button
              onClick={() => setActiveTab('hero-slides')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'hero-slides' ? 'bg-rose-50 border-r-2 border-rose-500 text-rose-600' : 'text-gray-600'
              }`}
            >
              <Image className="w-5 h-5 mr-3" />
              Hero Slides
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'analytics' ? 'bg-rose-50 border-r-2 border-rose-500 text-rose-600' : 'text-gray-600'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Analytics
            </button>
            
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'ai-assistant' ? 'bg-rose-50 border-r-2 border-rose-500 text-rose-600' : 'text-gray-600'
              }`}
            >
              <Bot className="w-5 h-5 mr-3" />
              AI Assistant
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'settings' ? 'bg-rose-50 border-r-2 border-rose-500 text-rose-600' : 'text-gray-600'
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'models' && renderModelsTab()}
          {activeTab === 'styles' && renderStylesTab()}
          {activeTab === 'hero-slides' && renderHeroSlidesTab()}
          {activeTab === 'settings' && renderSettingsTab()}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Analytics dashboard coming soon</p>
            </div>
          )}
          {activeTab === 'ai-assistant' && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">AI Assistant features coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModel && <AddModelModal />}
      {showAddStyle && <AddStyleModal />}
      {showAddSlide && <AddSlideModal />}
    </div>
  );
}
