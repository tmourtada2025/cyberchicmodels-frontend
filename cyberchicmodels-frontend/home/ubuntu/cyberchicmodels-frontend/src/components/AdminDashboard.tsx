import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Palette, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save, 
  X, 
  AlertTriangle,
  CheckCircle,
  LogOut,
  Image as ImageIcon,
  MessageCircle
} from 'lucide-react';
import { apiService } from '../lib/api';
import type { Model, Style, HeroSlide } from '../lib/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

const tabs: Tab[] = [
  { id: 'models', name: 'Models', icon: Users },
  { id: 'styles', name: 'Styles', icon: Palette },
  { id: 'hero', name: 'Hero Slides', icon: ImageIcon },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'chat', name: 'AI Assistant', icon: MessageCircle },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [models, setModels] = useState<Model[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch (activeTab) {
        case 'models':
          const modelsData = await apiService.getModels({ limit: 100 });
          setModels(modelsData);
          break;
        case 'styles':
          const stylesData = await apiService.getStyles({ limit: 100 });
          setStyles(stylesData);
          break;
        case 'hero':
          const heroData = await apiService.getHeroSlides();
          setHeroSlides(heroData);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Error loading data:', err);
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

  const renderModelsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Models Management</h2>
        <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{model.name}</h3>
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {model.thumbnail_url && (
                <img
                  src={model.thumbnail_url}
                  alt={model.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-2 text-sm text-gray-600">
                {model.age && <p>Age: {model.age}</p>}
                {model.nationality && <p>Nationality: {model.nationality}</p>}
                {model.specialties && <p>Specialties: {model.specialties.join(', ')}</p>}
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
        <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{style.name}</h3>
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {style.image_url && (
                <img
                  src={style.image_url}
                  alt={style.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-2 text-sm text-gray-600">
                <p>Price: ${style.price_usd?.toFixed(2) || '1.99'}</p>
                {style.clothing_type && <p>Type: {style.clothing_type}</p>}
                {style.colors && <p>Colors: {style.colors.join(', ')}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHeroTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hero Slides Management</h2>
        <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center">
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
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No hero slides found</p>
          <p className="text-sm text-gray-500">Hero slides will appear here once the backend API is connected</p>
        </div>
      ) : (
        <div className="space-y-4">
          {heroSlides.map(slide => (
            <div key={slide.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{slide.title}</h3>
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {slide.subtitle && <p className="text-gray-600 mb-2">{slide.subtitle}</p>}
              {slide.description && <p className="text-gray-700 mb-4">{slide.description}</p>}
              <div className="flex items-center space-x-4">
                <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-sm">
                  {slide.button_text}
                </span>
                <span className="text-sm text-gray-500">→ {slide.button_link}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Assistant Chat</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">AI Assistant Chat Interface</p>
          <p className="text-sm text-gray-500 mb-6">
            This will be your embedded chat interface with the AI assistant for managing models, 
            generating collections, and automating workflows.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-600 mb-2">Example commands you'll be able to use:</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• "Generate a new model with Nordic features"</li>
              <li>• "Create a minimalist collection for Elīna"</li>
              <li>• "Analyze trending styles and create new models"</li>
              <li>• "Extract outfits from the latest collection"</li>
              <li>• "Generate TikTok videos for top 3 models"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Models</h3>
          <p className="text-3xl font-bold text-rose-500">{models.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Styles</h3>
          <p className="text-3xl font-bold text-blue-500">{styles.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Hero Slides</h3>
          <p className="text-3xl font-bold text-green-500">{heroSlides.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">API Status</h3>
          <p className="text-sm text-gray-500">Backend Pending</p>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Base URL
            </label>
            <input
              type="text"
              value={import.meta.env.VITE_API_BASE_URL || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Cloud Storage URL
            </label>
            <input
              type="text"
              value={import.meta.env.VITE_GCS_BUCKET_URL || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <p className="text-sm text-gray-500">
            Environment variables are configured in your deployment settings.
          </p>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'models':
        return renderModelsTab();
      case 'styles':
        return renderStylesTab();
      case 'hero':
        return renderHeroTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'chat':
        return renderChatTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderModelsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold">CyberChicModels.ai Admin</h1>
            <button
              onClick={onLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-rose-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Status Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-green-700">{success}</span>
              </div>
            )}

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
