import React, { useState, useEffect } from 'react';
import { Users, Palette, Image, BarChart3, Bot, Settings, Plus, DoorOpen, X, Upload, Tag } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Model {
  id: number;
  name: string;
  tagline?: string;
  nationality?: string;
  age?: number;
  bio?: string;
  price_usd: number;
  is_featured: boolean;
  is_new: boolean;
  is_coming: boolean;
  is_popular: boolean;
}

interface Style {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price_usd: number;
  is_featured: boolean;
  is_new: boolean;
}

interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  button_text: string;
  button_link: string;
  background_image_url?: string;
  display_order: number;
  is_active: boolean;
}

const API_BASE = 'https://cyberchicmodels-api-719300876829.us-central1.run.app/api';

export function AdminDashboardEnhanced({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [models, setModels] = useState<Model[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal states
  const [showAddModel, setShowAddModel] = useState(false);
  const [showAddStyle, setShowAddStyle] = useState(false);
  const [showAddSlide, setShowAddSlide] = useState(false);

  // Form states
  const [modelForm, setModelForm] = useState({
    name: '',
    tagline: '',
    nationality: '',
    age: '',
    bio: '',
    price_usd: '',
    is_featured: false,
    is_new: true,
    is_coming: false,
    is_popular: false,
    collections: [] as string[]
  });

  const [styleForm, setStyleForm] = useState({
    name: '',
    description: '',
    category: '',
    price_usd: '',
    is_featured: false,
    is_new: true,
    colors: [] as string[],
    sizes: [] as string[]
  });

  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    button_text: 'Shop Now',
    button_link: '/',
    display_order: 1,
    is_active: true,
    background_color: '#667eea'
  });

  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [newCollection, setNewCollection] = useState('');
  const [newColor, setNewColor] = useState('#000000');
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [modelsRes, stylesRes, slidesRes] = await Promise.all([
        fetch(`${API_BASE}/models`).catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
        fetch(`${API_BASE}/styles`).catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
        fetch(`${API_BASE}/hero-slides`).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
      ]);

      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        setModels(Array.isArray(modelsData) ? modelsData : []);
      }

      if (stylesRes.ok) {
        const stylesData = await stylesRes.json();
        setStyles(Array.isArray(stylesData) ? stylesData : []);
      }

      if (slidesRes.ok) {
        const slidesData = await slidesRes.json();
        setHeroSlides(Array.isArray(slidesData) ? slidesData : []);
      }

      // Check if any request failed
      if (!modelsRes.ok && !stylesRes.ok && !slidesRes.ok) {
        setError('Backend API connection failed. Please check CORS configuration.');
      }

    } catch (err) {
      setError('Failed to load data. Backend may not be connected.');
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(message);
      setSuccess(null);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to exit the admin panel?')) {
      onLogout();
    }
  };

  // Image upload functions
  const getSignedUrl = async (filename: string, contentType: string, folder: string = 'general') => {
    const response = await fetch(`${API_BASE}/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename, contentType, folder })
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    return response.json();
  };

  const uploadImage = async (file: File, metadata: any) => {
    try {
      const { uploadUrl, objectName, publicUrl } = await getSignedUrl(file.name, file.type, metadata.folder || 'general');

      // Upload to GCS
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      // Confirm upload
      const confirmResponse = await fetch(`${API_BASE}/images/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          objectName,
          publicUrl,
          ...metadata
        })
      });

      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm image upload');
      }

      return { publicUrl, objectName };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleImageUpload = (files: FileList | null, imageType: string) => {
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + index,
          file,
          preview: e.target?.result as string,
          type: imageType,
          angle: 'front',
          category: 'gallery',
          description: ''
        };
        setUploadedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId: number) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Collection management
  const addCollection = () => {
    if (newCollection.trim() && !modelForm.collections.includes(newCollection.trim())) {
      setModelForm(prev => ({
        ...prev,
        collections: [...prev.collections, newCollection.trim()]
      }));
      setNewCollection('');
    }
  };

  const removeCollection = (collection: string) => {
    setModelForm(prev => ({
      ...prev,
      collections: prev.collections.filter(c => c !== collection)
    }));
  };

  // Color management for styles
  const addColor = () => {
    if (newColor && !styleForm.colors.includes(newColor)) {
      setStyleForm(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
    }
  };

  const removeColor = (color: string) => {
    setStyleForm(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  // Size management for styles
  const addSize = () => {
    if (newSize.trim() && !styleForm.sizes.includes(newSize.trim())) {
      setStyleForm(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setStyleForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  // Form submissions
  const submitModel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...modelForm,
          age: modelForm.age ? parseInt(modelForm.age) : null,
          price_usd: modelForm.price_usd ? parseFloat(modelForm.price_usd) : 0
        })
      });

      if (response.ok) {
        const result = await response.json();
        showMessage(`✅ Model "${modelForm.name}" created successfully!`, 'success');
        
        // Upload images if any
        if (uploadedImages.length > 0) {
          for (const image of uploadedImages) {
            try {
              await uploadImage(image.file, {
                kind: 'model',
                model_id: result.id,
                angle: image.angle,
                category: image.category,
                description: image.description,
                folder: 'models'
              });
            } catch (error) {
              console.error('Image upload failed:', error);
            }
          }
        }

        // Reset form
        setModelForm({
          name: '', tagline: '', nationality: '', age: '', bio: '', price_usd: '',
          is_featured: false, is_new: true, is_coming: false, is_popular: false, collections: []
        });
        setUploadedImages([]);
        setShowAddModel(false);
        loadData();
      } else {
        const errorData = await response.text();
        showMessage(`❌ Failed to create model: ${errorData}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ Error: ${error}`, 'error');
    }
  };

  const submitStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/styles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...styleForm,
          price_usd: styleForm.price_usd ? parseFloat(styleForm.price_usd) : 0
        })
      });

      if (response.ok) {
        const result = await response.json();
        showMessage(`✅ Style "${styleForm.name}" created successfully!`, 'success');
        
        // Upload images if any
        if (uploadedImages.length > 0) {
          for (const image of uploadedImages) {
            try {
              await uploadImage(image.file, {
                kind: 'style',
                style_id: result.id,
                angle: image.angle,
                category: image.category,
                description: image.description,
                folder: 'styles'
              });
            } catch (error) {
              console.error('Image upload failed:', error);
            }
          }
        }

        // Reset form
        setStyleForm({
          name: '', description: '', category: '', price_usd: '',
          is_featured: false, is_new: true, colors: [], sizes: []
        });
        setUploadedImages([]);
        setShowAddStyle(false);
        loadData();
      } else {
        const errorData = await response.text();
        showMessage(`❌ Failed to create style: ${errorData}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ Error: ${error}`, 'error');
    }
  };

  const submitHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let backgroundImageUrl = '';
      
      // Upload background image if any
      if (uploadedImages.length > 0) {
        const backgroundImage = uploadedImages[0];
        try {
          const result = await uploadImage(backgroundImage.file, {
            kind: 'hero',
            category: 'hero',
            hero_order: heroForm.display_order,
            description: `Background for ${heroForm.title}`,
            folder: 'hero-slides'
          });
          backgroundImageUrl = result.publicUrl;
        } catch (error) {
          console.error('Background image upload failed:', error);
        }
      }

      const response = await fetch(`${API_BASE}/hero-slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...heroForm,
          background_image_url: backgroundImageUrl
        })
      });

      if (response.ok) {
        showMessage(`✅ Hero slide "${heroForm.title}" created successfully!`, 'success');
        
        // Reset form
        setHeroForm({
          title: '', subtitle: '', button_text: 'Shop Now', button_link: '/',
          display_order: 1, is_active: true, background_color: '#667eea'
        });
        setUploadedImages([]);
        setShowAddSlide(false);
        loadData();
      } else {
        const errorData = await response.text();
        showMessage(`❌ Failed to create hero slide: ${errorData}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ Error: ${error}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">CyberChicModels.ai Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                <DoorOpen className="w-4 h-4 mr-2" />
                Exit Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mx-4 mt-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mx-4 mt-4">
          {error}
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {[
                { id: 'models', label: 'Models', icon: Users, count: models.length },
                { id: 'styles', label: 'Styles', icon: Palette, count: styles.length },
                { id: 'hero-slides', label: 'Hero Slides', icon: Image, count: heroSlides.length },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id
                      ? 'bg-rose-100 text-rose-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {item.count !== undefined && (
                    <span className="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Models Tab */}
          {activeTab === 'models' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Models Management</h2>
                <button
                  onClick={() => setShowAddModel(true)}
                  className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Model
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
              ) : models.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No models found</p>
                  <p className="text-sm text-gray-500 mt-2">Models will appear here once the backend API is connected</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {models.map((model) => (
                    <div key={model.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="font-semibold text-lg mb-2">{model.name}</h3>
                      {model.tagline && <p className="text-gray-600 text-sm mb-2">{model.tagline}</p>}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {model.is_featured && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">⭐ Featured</span>}
                        {model.is_new && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">🆕 New</span>}
                        {model.is_coming && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">🔜 Coming Soon</span>}
                        {model.is_popular && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">🔥 Popular</span>}
                      </div>
                      <p className="text-sm text-gray-500">${model.price_usd}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Styles Tab */}
          {activeTab === 'styles' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Styles Management</h2>
                <button
                  onClick={() => setShowAddStyle(true)}
                  className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Style
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
              ) : styles.length === 0 ? (
                <div className="text-center py-12">
                  <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No styles found</p>
                  <p className="text-sm text-gray-500 mt-2">Styles will appear here once the backend API is connected</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {styles.map((style) => (
                    <div key={style.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="font-semibold text-lg mb-2">{style.name}</h3>
                      {style.description && <p className="text-gray-600 text-sm mb-2">{style.description}</p>}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {style.is_featured && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">⭐ Featured</span>}
                        {style.is_new && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">🆕 New</span>}
                      </div>
                      <p className="text-sm text-gray-500">${style.price_usd}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hero Slides Tab */}
          {activeTab === 'hero-slides' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Hero Slides Management</h2>
                <button
                  onClick={() => setShowAddSlide(true)}
                  className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Slide
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
              ) : heroSlides.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hero slides found</p>
                  <p className="text-sm text-gray-500 mt-2">Hero slides will appear here once the backend API is connected</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {heroSlides.map((slide) => (
                    <div key={slide.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg">{slide.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Order: {slide.display_order}
                        </span>
                      </div>
                      {slide.subtitle && <p className="text-gray-600 text-sm mb-2">{slide.subtitle}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{slide.button_text}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          slide.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {slide.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Other tabs */}
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

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Base URL</label>
                    <input
                      type="text"
                      value={API_BASE}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Cloud Storage URL</label>
                    <input
                      type="text"
                      value="https://storage.googleapis.com/cyberchicmodels-media"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Environment variables are configured in your deployment settings.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Model Modal */}
      {showAddModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Model</h3>
                <button
                  onClick={() => setShowAddModel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={submitModel} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Name *</label>
                    <input
                      type="text"
                      required
                      value={modelForm.name}
                      onChange={(e) => setModelForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="e.g., Sophia Martinez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={modelForm.tagline}
                      onChange={(e) => setModelForm(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="e.g., Fashion Forward"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={modelForm.nationality}
                      onChange={(e) => setModelForm(prev => ({ ...prev, nationality: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="e.g., Spanish"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={modelForm.age}
                      onChange={(e) => setModelForm(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={modelForm.price_usd}
                    onChange={(e) => setModelForm(prev => ({ ...prev, price_usd: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="1.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={modelForm.bio}
                    onChange={(e) => setModelForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Professional fashion model with experience in..."
                  />
                </div>

                {/* Model Flags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model Flags</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={modelForm.is_featured}
                        onChange={(e) => setModelForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="mr-2"
                      />
                      ⭐ Featured
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={modelForm.is_new}
                        onChange={(e) => setModelForm(prev => ({ ...prev, is_new: e.target.checked }))}
                        className="mr-2"
                      />
                      🆕 New
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={modelForm.is_coming}
                        onChange={(e) => setModelForm(prev => ({ ...prev, is_coming: e.target.checked }))}
                        className="mr-2"
                      />
                      🔜 Coming Soon
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={modelForm.is_popular}
                        onChange={(e) => setModelForm(prev => ({ ...prev, is_popular: e.target.checked }))}
                        className="mr-2"
                      />
                      🔥 Popular
                    </label>
                  </div>
                </div>

                {/* Collections */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collections</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newCollection}
                      onChange={(e) => setNewCollection(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCollection())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter collection name"
                    />
                    <button
                      type="button"
                      onClick={addCollection}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {modelForm.collections.map((collection) => (
                      <span
                        key={collection}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
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
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files, 'model')}
                      className="hidden"
                      id="model-images"
                    />
                    <label htmlFor="model-images" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload images or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative border rounded-lg p-3">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <div className="space-y-2">
                            <select
                              value={image.angle}
                              onChange={(e) => {
                                const newImages = uploadedImages.map(img =>
                                  img.id === image.id ? { ...img, angle: e.target.value } : img
                                );
                                setUploadedImages(newImages);
                              }}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="front">Front View</option>
                              <option value="back">Back View</option>
                              <option value="left">Left Side</option>
                              <option value="right">Right Side</option>
                              <option value="three_quarter">Three Quarter</option>
                              <option value="detail">Detail Shot</option>
                            </select>
                            <select
                              value={image.category}
                              onChange={(e) => {
                                const newImages = uploadedImages.map(img =>
                                  img.id === image.id ? { ...img, category: e.target.value } : img
                                );
                                setUploadedImages(newImages);
                              }}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="thumbnail">Thumbnail</option>
                              <option value="gallery">Gallery</option>
                              <option value="hero">Hero Image</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Description"
                              value={image.description}
                              onChange={(e) => {
                                const newImages = uploadedImages.map(img =>
                                  img.id === image.id ? { ...img, description: e.target.value } : img
                                );
                                setUploadedImages(newImages);
                              }}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModel(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                  >
                    Create Model
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Style Modal */}
      {showAddStyle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Style</h3>
                <button
                  onClick={() => setShowAddStyle(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={submitStyle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style Name *</label>
                  <input
                    type="text"
                    required
                    value={styleForm.name}
                    onChange={(e) => setStyleForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="e.g., Evening Glam Dress"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={styleForm.description}
                    onChange={(e) => setStyleForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Elegant evening dress perfect for special occasions..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={styleForm.category}
                      onChange={(e) => setStyleForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="">Select Category</option>
                      <option value="dress">Dress</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={styleForm.price_usd}
                      onChange={(e) => setStyleForm(prev => ({ ...prev, price_usd: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="29.99"
                    />
                  </div>
                </div>

                {/* Style Flags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style Flags</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={styleForm.is_featured}
                        onChange={(e) => setStyleForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="mr-2"
                      />
                      ⭐ Featured
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={styleForm.is_new}
                        onChange={(e) => setStyleForm(prev => ({ ...prev, is_new: e.target.checked }))}
                        className="mr-2"
                      />
                      🆕 New
                    </label>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add Color
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {styleForm.colors.map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                      >
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: color }}
                        ></div>
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="ml-2 text-gray-600 hover:text-gray-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="e.g., XS, S, M, L, XL"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add Size
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {styleForm.sizes.map((size) => (
                      <span
                        key={size}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files, 'style')}
                      className="hidden"
                      id="style-images"
                    />
                    <label htmlFor="style-images" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload images or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative border rounded-lg p-3">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <div className="space-y-2">
                            <select
                              value={image.angle}
                              onChange={(e) => {
                                const newImages = uploadedImages.map(img =>
                                  img.id === image.id ? { ...img, angle: e.target.value } : img
                                );
                                setUploadedImages(newImages);
                              }}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="front">Front View</option>
                              <option value="back">Back View</option>
                              <option value="left">Left Side</option>
                              <option value="right">Right Side</option>
                              <option value="detail">Detail Shot</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Description"
                              value={image.description}
                              onChange={(e) => {
                                const newImages = uploadedImages.map(img =>
                                  img.id === image.id ? { ...img, description: e.target.value } : img
                                );
                                setUploadedImages(newImages);
                              }}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddStyle(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                  >
                    Create Style
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Hero Slide Modal */}
      {showAddSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Hero Slide</h3>
                <button
                  onClick={() => setShowAddSlide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={submitHeroSlide} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slide Title *</label>
                  <input
                    type="text"
                    required
                    value={heroForm.title}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="e.g., Discover Your Style"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="e.g., Premium AI-generated fashion models"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={heroForm.button_text}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, button_text: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Shop Now"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={heroForm.button_link}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, button_link: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      placeholder="/models"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carousel Order</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={heroForm.display_order}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    <input
                      type="color"
                      value={heroForm.background_color}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, background_color: e.target.value }))}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={heroForm.is_active}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="mr-2"
                    />
                    Active Slide
                  </label>
                </div>

                {/* Background Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files, 'hero')}
                      className="hidden"
                      id="hero-image"
                    />
                    <label htmlFor="hero-image" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload background image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB (recommended: 1920x1080)</p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <div className="relative border rounded-lg p-3">
                        <img
                          src={uploadedImages[0].preview}
                          alt="Background Preview"
                          className="w-full h-48 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedImages([])}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
                  <div 
                    className="relative rounded-lg p-8 text-white min-h-[200px] flex items-center justify-center"
                    style={{ 
                      backgroundColor: heroForm.background_color,
                      backgroundImage: uploadedImages.length > 0 ? `url(${uploadedImages[0].preview})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">{heroForm.title || 'Slide Title'}</h2>
                      {heroForm.subtitle && <p className="text-lg mb-4">{heroForm.subtitle}</p>}
                      <button className="bg-white text-gray-900 px-6 py-2 rounded-md font-medium">
                        {heroForm.button_text}
                      </button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Order: {heroForm.display_order}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddSlide(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                  >
                    Create Hero Slide
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
