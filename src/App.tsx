import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Star, ChevronRight, ArrowRight, Video, Image, Monitor, Download, Palette, LayoutGrid, FileCheck, Paintbrush } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ModelsPage } from './components/ModelsPage';
import { ModelProfilePage } from './components/ModelProfilePage';
import { StylesPage } from './components/StylesPage';
import { StyleDetailsPage } from './components/StyleDetailsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { CartPage } from './components/CartPage';
import { FavoritesPage } from './components/FavoritesPage';
import { AdminPage } from './components/AdminPage';
import { SimpleModelsCheck } from './components/SimpleModelsCheck';
import { HeroCarousel } from './components/HeroCarousel';
import { Footer } from './components/Footer';
import { ModelCard } from './components/ModelCard';
import { ModelDetailModal } from './components/ModelDetailModal';
import { StylesCarousel } from './components/StylesCarousel';
import { apiService } from './lib/api-simple';
import type { Model } from './lib/api-simple';

function App() {
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured content from API
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured models
        const modelsData = await apiService.getModels();
        
        // Filter for featured models
        const featuredModelsData = modelsData.filter(model => model.is_featured);
        
        setFeaturedModels(featuredModelsData.length > 0 ? featuredModelsData : modelsData.slice(0, 6));

      } catch (err) {
        console.error('Error fetching featured content:', err);
        setError('Failed to load content');
        // Set empty array as fallback
        setFeaturedModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  const handleModelClick = (model: Model) => {
    setSelectedModel(model);
  };

  const handleCloseModal = () => {
    setSelectedModel(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <div>
              <HeroCarousel />

              {/* About Preview Section */}
              <div id="main-content" className="py-12 px-4 bg-gradient-to-b from-rose-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-serif mb-4">About CyberChicModels.ai</h2>
                  <p className="text-lg text-gray-600">
                    A curated digital platform offering AI-generated fashion models for editorial, branding, and creative content. 
                    Our stylish influencers are ready for download, with consistent visual packs tailored for modern creators.
                  </p>
                </div>
              </div>

              {/* Featured Models Section */}
              <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-serif mb-8 text-center">Featured Models</h2>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">Unable to load models at the moment</p>
                      <p className="text-sm text-gray-500">Please check back later</p>
                    </div>
                  ) : featuredModels.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredModels.slice(0, 3).map(model => (
                          <ModelCard 
                            key={model.id} 
                            model={model} 
                            onModelClick={handleModelClick}
                          />
                        ))}
                      </div>
                      <div className="mt-6 text-center">
                        <Link 
                          to="/models"
                          className="inline-flex items-center text-black hover:text-rose-500 transition"
                        >
                          View All Models
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No featured models available</p>
                      <p className="text-sm text-gray-500">New models coming soon!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* What's Included Section */}
              <div className="py-12 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4">
                  <h2 className="text-3xl font-serif mb-4 text-center">What's Included in a Pack</h2>
                  <p className="text-lg text-center text-gray-300 mb-10 max-w-3xl mx-auto">
                    Explore our premium downloads — each pack is crafted for creators, developers, and digital stylists.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Model Pack */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-xl font-serif mb-4 flex items-center">
                        <Image className="h-6 w-6 mr-3 text-rose-300" />
                        Model Pack Includes:
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Image className="h-5 w-5 mr-3 mt-1 text-rose-300" />
                          <p className="text-sm">30+ high-resolution fashion portraits</p>
                        </div>
                        <div className="flex items-start">
                          <Video className="h-5 w-5 mr-3 mt-1 text-rose-300" />
                          <p className="text-sm">Short videos for motion training & storytelling</p>
                        </div>
                        <div className="flex items-start">
                          <Monitor className="h-5 w-5 mr-3 mt-1 text-rose-300" />
                          <p className="text-sm">Clean, studio-style backgrounds</p>
                        </div>
                        <div className="flex items-start">
                          <FileCheck className="h-5 w-5 mr-3 mt-1 text-rose-300" />
                          <p className="text-sm">Ready for AI training and commercial use</p>
                        </div>
                      </div>
                    </div>

                    {/* Style Pack */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-xl font-serif mb-4 flex items-center">
                        <Paintbrush className="h-6 w-6 mr-3 text-rose-300" />
                        Style Pack Includes:
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <LayoutGrid className="h-5 w-5 mr-3 mt-1 text-rose-300" />
                          <p className="text-sm">Full-body fashion renders across angles</p>
                        </div>
                        <div className="flex items-start">
                          <Palette className="h-5 w-5 mr-3 mt-1 text-rose-300" />
                          <p className="text-sm">Color swatch variants with seamless integration</p>
                        </div>
                        <div className="flex items-start">
                          <Download className="h-5 w-5 mr-3 mt-1 text-rose-300" />
                          <p className="text-sm">Transparent backgrounds for drag-and-drop design</p>
                        </div>
                        <div className="flex items-start">
                          <FileCheck className="h-5 w-5 mr-3 mt-1 text-rose-300" />
                          <p className="text-sm">Royalty-free license for creative & commercial projects</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* New Models Weekly Section */}
              <div className="py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-serif mb-4">New Models Weekly</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    We're adding new digital influencers weekly. Come back often to explore fresh faces.
                  </p>
                  <Link 
                    to="/models"
                    className="inline-flex items-center text-black hover:text-rose-500 transition"
                  >
                    Browse All Models
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              <Footer />
            </div>
          } />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/model/:id" element={<ModelProfilePage />} />
          <Route path="/styles" element={<StylesPage />} />
          <Route path="/style/:id" element={<StyleDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/check-models" element={<SimpleModelsCheck />} />
        </Routes>
        {selectedModel && (
          <ModelDetailModal
            model={selectedModel}
            allModels={featuredModels}
            onClose={handleCloseModal}
            onModelChange={handleModelClick}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
