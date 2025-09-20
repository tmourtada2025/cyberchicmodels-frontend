import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ChevronRight, Video, Image, Monitor, Download, Palette, LayoutGrid, FileCheck, Paintbrush, X, ChevronLeft, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'

// Mock API Service with 11 models
const mockApiService = {
  async getModels() {
    return [
      {
        id: 'av01',
        slug: 'aria-valen',
        name: 'Aria Valen',
        tagline: 'Luxury Runway Specialist',
        nationality: 'Italian',
        ethnicity: 'Caucasian',
        gender: 'Female',
        age: 27,
        height: '178cm',
        weight: '56kg',
        bio: 'Professional luxury runway and high-fashion model with expertise in swimwear and resort wear campaigns.',
        hobbies: 'Sailing, oil painting, Classical music',
        specialties: ['Luxury runway', 'high-fashion', 'swimwear'],
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
        tagline: 'Beauty & Product Specialist',
        nationality: 'American',
        ethnicity: 'Caucasian',
        gender: 'Female',
        age: 24,
        height: '176cm',
        weight: '58kg',
        bio: 'Specialized beauty and premium product model with a keen eye for fashion concepts.',
        hobbies: 'Sketching fashion concepts, travel photography',
        specialties: ['Beauty close-ups', 'product modeling'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/nv01-nova-vion-thumbnail.webp',
        is_featured: false,
        is_new: false,
        is_popular: true,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'fm01',
        slug: 'freja-madsen',
        name: 'Freja Madsen',
        tagline: 'Contemporary Lifestyle',
        nationality: 'Finnish',
        ethnicity: 'Caucasian',
        gender: 'Female',
        age: 20,
        height: '180cm',
        weight: '56kg',
        bio: 'Young contemporary lifestyle model specializing in morning editorials and wellness campaigns.',
        hobbies: 'Light yoga and stretching, morning journaling',
        specialties: ['Contemporary lifestyle', 'morning editorials'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/fm01-freja-madsen-thumbnail.webp',
        is_featured: false,
        is_new: true,
        is_popular: false,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'zc01',
        slug: 'zara-chen',
        name: 'Zara Chen',
        tagline: 'Editorial Fashion Expert',
        nationality: 'Chinese',
        ethnicity: 'Asian',
        gender: 'Female',
        age: 26,
        height: '175cm',
        weight: '54kg',
        bio: 'Editorial fashion model with expertise in high-end fashion photography and luxury brand campaigns.',
        hobbies: 'Photography, modern art, tea ceremony',
        specialties: ['Editorial fashion', 'luxury brands', 'art direction'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/zc01-zara-chen-thumbnail.webp',
        is_featured: true,
        is_new: false,
        is_popular: true,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'im01',
        slug: 'isabella-martinez',
        name: 'Isabella Martinez',
        tagline: 'Versatile Commercial Model',
        nationality: 'Spanish',
        ethnicity: 'Hispanic',
        gender: 'Female',
        age: 25,
        height: '172cm',
        weight: '55kg',
        bio: 'Versatile commercial model specializing in lifestyle and beauty campaigns with natural, approachable style.',
        hobbies: 'Dancing, cooking, outdoor adventures',
        specialties: ['Commercial lifestyle', 'beauty campaigns', 'natural style'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/im01-isabella-martinez-thumbnail.webp',
        is_featured: false,
        is_new: false,
        is_popular: false,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'ak01',
        slug: 'amara-kone',
        name: 'Amara Kone',
        tagline: 'Elegant Portrait Specialist',
        nationality: 'Ivorian',
        ethnicity: 'African',
        gender: 'Female',
        age: 28,
        height: '177cm',
        weight: '57kg',
        bio: 'Elegant portrait model with expertise in sophisticated fashion and luxury beauty campaigns.',
        hobbies: 'Classical ballet, jewelry design, cultural arts',
        specialties: ['Portrait photography', 'luxury beauty', 'sophisticated fashion'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/ak01-amara-kone-thumbnail.webp',
        is_featured: true,
        is_new: false,
        is_popular: false,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'lp01',
        slug: 'luna-petrov',
        name: 'Luna Petrov',
        tagline: 'Avant-garde Fashion Model',
        nationality: 'Russian',
        ethnicity: 'Caucasian',
        gender: 'Female',
        age: 23,
        height: '179cm',
        weight: '53kg',
        bio: 'Avant-garde fashion model known for striking editorial work and experimental fashion concepts.',
        hobbies: 'Contemporary art, experimental music, fashion design',
        specialties: ['Avant-garde fashion', 'experimental concepts', 'editorial work'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/lp01-luna-petrov-thumbnail.webp',
        is_featured: false,
        is_new: true,
        is_popular: false,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'sk01',
        slug: 'sophia-kim',
        name: 'Sophia Kim',
        tagline: 'K-Beauty Specialist',
        nationality: 'Korean',
        ethnicity: 'Asian',
        gender: 'Female',
        age: 22,
        height: '168cm',
        weight: '50kg',
        bio: 'K-beauty specialist model with expertise in skincare, cosmetics, and contemporary Asian fashion trends.',
        hobbies: 'Skincare research, K-pop dance, digital art',
        specialties: ['K-beauty', 'skincare campaigns', 'contemporary Asian fashion'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/sk01-sophia-kim-thumbnail.webp',
        is_featured: false,
        is_new: false,
        is_popular: true,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'er01',
        slug: 'elena-rossi',
        name: 'Elena Rossi',
        tagline: 'Classic Beauty Model',
        nationality: 'Italian',
        ethnicity: 'Caucasian',
        gender: 'Female',
        age: 29,
        height: '174cm',
        weight: '56kg',
        bio: 'Classic beauty model with timeless elegance, specializing in luxury fashion and heritage brand campaigns.',
        hobbies: 'Opera, wine tasting, Renaissance art',
        specialties: ['Classic beauty', 'luxury fashion', 'heritage brands'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/er01-elena-rossi-thumbnail.webp',
        is_featured: false,
        is_new: false,
        is_popular: false,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'mj01',
        slug: 'maya-jackson',
        name: 'Maya Jackson',
        tagline: 'Athletic Lifestyle Model',
        nationality: 'American',
        ethnicity: 'Mixed',
        gender: 'Female',
        age: 24,
        height: '173cm',
        weight: '58kg',
        bio: 'Athletic lifestyle model specializing in sportswear, wellness, and active lifestyle campaigns.',
        hobbies: 'Rock climbing, yoga, nutrition coaching',
        specialties: ['Athletic wear', 'wellness campaigns', 'active lifestyle'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/mj01-maya-jackson-thumbnail.webp',
        is_featured: false,
        is_new: false,
        is_popular: false,
        is_coming_soon: false,
        price_usd: 99.00
      },
      {
        id: 'ap01',
        slug: 'anya-petersen',
        name: 'Anya Petersen',
        tagline: 'Scandinavian Minimalist',
        nationality: 'Swedish',
        ethnicity: 'Caucasian',
        gender: 'Female',
        age: 26,
        height: '176cm',
        weight: '55kg',
        bio: 'Scandinavian minimalist model known for clean, modern aesthetic and sustainable fashion campaigns.',
        hobbies: 'Sustainable living, minimalist design, forest hiking',
        specialties: ['Minimalist fashion', 'sustainable brands', 'clean aesthetic'],
        thumbnail_url: 'https://storage.googleapis.com/cyberchicmodels-media/models/thumbnails/ap01-anya-petersen-thumbnail.webp',
        is_featured: false,
        is_new: false,
        is_popular: false,
        is_coming_soon: true,
        price_usd: 99.00
      }
    ];
  }
};

// Simple Navbar Component
function SimpleNavbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif">CyberChicModels.ai</Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/models" className="text-gray-700 hover:text-black">Models</Link>
            <Link to="/about" className="text-gray-700 hover:text-black">About</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Simple Footer Component
function SimpleFooter() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2024 CyberChicModels.ai. All rights reserved.</p>
      </div>
    </footer>
  );
}

// Model Card Component
function ModelCard({ model, onModelClick }) {
  return (
    <div
      className="relative w-full h-[500px] group cursor-pointer"
      onClick={() => onModelClick(model)}
    >
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-2 transform -translate-x-2 -translate-y-2">
        {model.is_popular && (
          <div className="bg-rose-300 text-white py-2 px-3 rounded-tl-lg rounded-br-lg font-medium shadow-lg text-sm">
            Most Popular
          </div>
        )}
        {model.is_new && (
          <div className="bg-black text-white py-2 px-3 rounded-tl-lg rounded-br-lg font-medium shadow-lg text-sm">
            New Addition
          </div>
        )}
        {model.is_coming_soon && (
          <div className="bg-red-500 text-white py-2 px-3 rounded-tl-lg rounded-br-lg font-medium shadow-lg text-sm">
            Coming Soon
          </div>
        )}
      </div>
      
      <div className="relative w-full h-full">
        <img 
          src={model.thumbnail_url}
          alt={model.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        {/* Model Info - Always Visible */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-xl font-serif mb-2 leading-tight">{model.name}</h3>
          <p className="text-white/90 text-sm mb-1 leading-tight">
            {model.tagline}
          </p>
          <p className="text-white/70 text-sm leading-tight">{model.nationality} • {model.age} years</p>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full transition flex items-center hover:bg-white/30">
            <Heart className="h-5 w-5 text-white" />
            <span className="ml-1 text-white text-sm">0</span>
          </button>
          <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition">
            <Star className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      </div>
    </div>
  );
}

// Modal Component
function ModelModal({ model, onClose }) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  
  const photos = [
    {
      url: model.thumbnail_url,
      caption: `${model.name} - Profile Photo`
    },
    {
      url: `https://storage.googleapis.com/cyberchicmodels-media/models/headshots/${model.slug}-headshot.webp`,
      caption: `${model.name} - Headshot`
    },
    {
      url: `https://storage.googleapis.com/cyberchicmodels-media/models/full-body/${model.slug}-full-body.webp`,
      caption: `${model.name} - Full Body`
    }
  ];

  const handlePrevPhoto = () => {
    setCurrentPhoto(prev => prev === 0 ? photos.length - 1 : prev - 1);
  };

  const handleNextPhoto = () => {
    setCurrentPhoto(prev => prev === photos.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-[95vw] h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-black/80 backdrop-blur-sm p-3 rounded-full hover:bg-black transition-all duration-200 group"
        >
          <X className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          {/* Image Section */}
          <div className="lg:col-span-2 relative bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full h-full flex items-center justify-center max-h-[85vh]">
              <img
                src={photos[currentPhoto].url}
                alt={photos[currentPhoto].caption}
                className="max-w-[90%] max-h-[75vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // Fallback to thumbnail if image fails
                  e.currentTarget.src = model.thumbnail_url;
                }}
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ChevronLeft className="h-4 w-4 text-gray-800" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ChevronRight className="h-4 w-4 text-gray-800" />
            </button>

            {/* Photo Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full text-gray-800 text-sm shadow-lg font-medium">
              {currentPhoto + 1} / {photos.length}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif mb-2">{model.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{model.tagline}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Age:</span> {model.age}</p>
                  <p><span className="font-medium">Nationality:</span> {model.nationality}</p>
                  <p><span className="font-medium">Ethnicity:</span> {model.ethnicity}</p>
                  <p><span className="font-medium">Height:</span> {model.height}</p>
                  <p><span className="font-medium">Weight:</span> {model.weight}</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{model.bio}</p>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="font-medium mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {model.specialties.map(specialty => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hobbies */}
              <div>
                <h3 className="font-medium mb-2">Hobbies</h3>
                <p className="text-sm text-gray-600">{model.hobbies}</p>
              </div>

              {/* Price and Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">${model.price_usd}</p>
                    <p className="text-sm text-gray-600">Complete photo pack</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {model.is_featured && (
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {model.is_new && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        New
                      </span>
                    )}
                    {model.is_popular && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <Button className="w-full mb-3 bg-rose-500 hover:bg-rose-600">
                  Add to Cart
                </Button>

                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Preview Pack
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [featuredModels, setFeaturedModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedModels = async () => {
      try {
        const models = await mockApiService.getModels();
        const featured = models.filter(model => model.is_featured);
        setFeaturedModels(featured.length > 0 ? featured : models.slice(0, 3));
      } catch (error) {
        console.error('Error fetching models:', error);
        setFeaturedModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedModels();
  }, []);

  const handleModelClick = (model) => {
    setSelectedModel(model);
  };

  const handleCloseModal = () => {
    setSelectedModel(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <SimpleNavbar />

      {/* Hero Section */}
      <div className="relative h-screen bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
            AI Fashion Models for a Digital World
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Browse and download ready-to-use model packs — for campaigns, content, or training your own AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/models"
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
            >
              Browse Models
            </Link>
            <button className="border border-gray-400 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Demo Pack
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-12 px-4 bg-gradient-to-b from-rose-50 to-white">
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
          ) : featuredModels.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredModels.map(model => (
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

      <SimpleFooter />

      {selectedModel && (
        <ModelModal
          model={selectedModel}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function ModelsPage() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await mockApiService.getModels();
        setModels(data);
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleModelClick = (model) => {
    setSelectedModel(model);
  };

  const handleCloseModal = () => {
    setSelectedModel(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <SimpleNavbar />
      
      {/* Header */}
      <div className="py-12 px-4 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors mr-4"
            >
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-serif mb-4">Our Models</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover our collection of AI-generated fashion models. Each model comes with a complete pack of high-resolution images perfect for your creative projects.
          </p>
        </div>
      </div>

      {/* Models Grid */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {models.length} models
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No models available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {models.map(model => (
                <ModelCard 
                  key={model.id} 
                  model={model} 
                  onModelClick={handleModelClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <SimpleFooter />

      {selectedModel && (
        <ModelModal
          model={selectedModel}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/models" element={<ModelsPage />} />
      </Routes>
    </Router>
  );
}

export default App
