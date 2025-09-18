import React, { useState, useEffect } from 'react';
import { Users, Palette, Image, BarChart3, Bot, Settings, Plus, LogOut, X, Home } from 'lucide-react';
import { apiService } from '../lib/api';
import type { Model, Style } from '../lib/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboardEnhanced({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [models, setModels] = useState<Model[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
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
      const [modelsData, stylesData, slidesData] = await Promise.all([
        apiService.getModels().catch(() => []),
        apiService.getStyles().catch(() => []),
        apiService.getHeroSlides().catch(() => [])
      ]);
      
      setModels(modelsData);
      setStyles(stylesData);
      setHeroSlides(slidesData);
    } catch (err) {
      setError('Failed to load data. Backend API may not be connected yet.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleCreateModel = async (formData: FormData) => {
    try {
      const modelData = {
        name: formData.get('name') as string,
        tagline: formData.get('tagline') as string,
        nationality: formData.get('nationality') as string,
        age: parseInt(formData.get('age') as string) || null,
        bio: formData.get('bio') as string,
        price_usd: parseFloat(formData.get('price') as string) || 1.99,
        is_featured: formData.get('featured') === 'on',
        is_new: formData.get('new') === 'on',
        is_coming: formData.get('coming') === 'on',
        is_popular: formData.get('popular') === 'on',
        status: 'published'
      };

      // Try to create model via API
      await apiService.createModel(modelData);
      showSuccess(`Model "${modelData.name}" created successfully!`);
      loadData(); // Refresh data
      setShowAddModel(false);
    } catch (err) {
      showError('Failed to create model. Please check backend connection.');
    }
  };

  const handleCreateStyle = async (formData: FormData) => {
    try {
      const styleData = {
        name: formData.get('name') as string,
        clothing_type: formData.get('clothing_type') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        price_usd: parseFloat(formData.get('price') as string) || 1.99,
        is_featured: formData.get('featured') === 'on',
        is_new: formData.get('new') === 'on',
        status: 'published'
      };

      await apiService.createStyle(styleData);
      showSuccess(`Style "${styleData.name}" created successfully!`);
      loadData();
      setShowAddStyle(false);
    } catch (err) {
      showError('Failed to create style. Please check backend connection.');
    }
  };

  const handleCreateHeroSlide = async (formData: FormData) => {
    try {
      const slideData = {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        button_text: formData.get('button_text') as string,
        button_link: formData.get('button_link') as string,
        description: formData.get('description') as string,
        background_color: formData.get('background_color') as string,
        display_order: parseInt(formData.get('display_order') as string) || 1,
        is_active: formData.get('active') === 'on',
        is_featured: formData.get('featured') === 'on'
      };

      await apiService.createHeroSlide(slideData);
      showSuccess(`Hero slide "${slideData.title}" created successfully!`);
      loadData();
      setShowAddSlide(false);
    } catch (err) {
      showError('Failed to create hero slide. Please check backend connection.');
    }
  };

  // Enhanced Add Model Modal Component
  const AddModelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add New Model</h3>
          <button onClick={() => setShowAddModel(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleCreateModel(formData);
        }} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name *</label>
              <input name="name" type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., Sophia Martinez" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input name="tagline" type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., Fashion Forward" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input name="nationality" type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., Spanish" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input name="age" type="number" min="18" max="65" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="25" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <input name="price" type="number" step="0.01" min="0.99" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="1.99" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea name="bio" rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Professional fashion model with experience in..."></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Model Flags</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="featured" type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm">⭐ Featured</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="new" type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm">🆕 New</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="coming" type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm">🔜 Coming Soon</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="popular" type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm">🔥 Popular</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
            <button type="button" onClick={() => setShowAddModel(false)} className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600">
              Create Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Enhanced Add Style Modal Component
  const AddStyleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add New Style</h3>
          <button onClick={() => setShowAddStyle(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleCreateStyle(formData);
        }} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style Name *</label>
              <input name="name" type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., Elegant Evening Dress" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clothing Type</label>
              <select name="clothing_type" className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Select type</option>
                <option value="dress">Dress</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessories">Accessories</option>
                <option value="shoes">Shoes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Select category</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="business">Business</option>
                <option value="party">Party</option>
                <option value="beach">Beach</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <input name="price" type="number" step="0.01" min="0.99" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="1.99" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Describe this style..."></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Style Flags</label>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="featured" type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm">⭐ Featured</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="new" type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm">🆕 New</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="bestseller" type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm">🏆 Bestseller</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
            <button type="button" onClick={() => setShowAddStyle(false)} className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600">
              Create Style
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Enhanced Add Hero Slide Modal Component
  const AddSlideModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add New Hero Slide</h3>
          <button onClick={() => setShowAddSlide(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleCreateHeroSlide(formData);
        }} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input name="title" type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., Discover Your Style" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input name="subtitle" type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., Explore our latest collection" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input name="button_text" type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., Shop Now" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input name="button_link" type="url" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input name="background_color" type="color" className="w-full border border-gray-300 rounded-md px-3 py-2 h-10" defaultValue="#667eea" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input name="display_order" type="number" min="1" max="10" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="1" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Describe this slide..."></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Slide Settings</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="active" type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-sm">✅ Active</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input name="featured" type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm">⭐ Featured</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
            <button type="button" onClick={() => setShowAddSlide(false)} className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600">
              Create Slide
            </button>
          </div>
        </form>
      </div>
    </div>
  );

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
          <p className="text-sm text-gray-500">Models will appear here once the backend API is connected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map(model => (
            <div key={model.id} className="bg-white rounded-lg shadow-md p-6">
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
          <p className="text-sm text-gray-500">Styles will appear here once the backend API is connected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map(style => (
            <div key={style.id} className="bg-white rounded-lg shadow-md p-6">
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
          <p className="text-sm text-gray-500">Hero slides will appear here once the backend API is connected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroSlides.map(slide => (
            <div key={slide.id} className="bg-white rounded-lg shadow-md p-6">
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
              value="https://cyberchicmodels-api-719300876829.us-central1.run.app"
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
      </div>
    </div>
   );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logout */}
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
                onClick={onLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
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
            ✅ {success}
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
