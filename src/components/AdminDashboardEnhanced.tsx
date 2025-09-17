
import React, { useState, useEffect } from 'react';
import { Users, Palette, Image, BarChart3, Bot, Settings, Plus, LogOut, X } from 'lucide-react';
import { apiService } from '../lib/api';
import type { Model, Style } from '../lib/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
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

  // Add Model Modal Component
  const AddModelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Model</h3>
          <button onClick={() => setShowAddModel(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          showSuccess('Model creation feature will be available once backend is connected');
          setShowAddModel(false);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter model name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter nationality" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter age" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => setShowAddModel(false)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600">
              Create Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Add Style Modal Component
  const AddStyleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Style</h3>
          <button onClick={() => setShowAddStyle(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          showSuccess('Style creation feature will be available once backend is connected');
          setShowAddStyle(false);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter style name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clothing Type</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Select type</option>
                <option value="dress">Dress</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="outerwear">Outerwear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="1.99" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => setShowAddStyle(false)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600">
              Create Style
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Add Slide Modal Component
  const AddSlideModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Hero Slide</h3>
          <button onClick={() => setShowAddSlide(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          showSuccess('Hero slide creation feature will be available once backend is connected');
          setShowAddSlide(false);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter slide title" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter subtitle" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter button text" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input type="url" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Enter button URL" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => setShowAddSlide(false)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600">
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <button 
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

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
      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 mx-6 mt-6">
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 mx-6 mt-6">
          ✅ {success}
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          
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
