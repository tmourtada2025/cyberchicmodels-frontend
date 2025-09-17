import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, ChevronDown } from 'lucide-react';
import { apiService } from '../lib/api';
import type { HeroSlide } from '../lib/api';

interface HeroCarouselProps {}

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScrollCue, setShowScrollCue] = useState(true);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch hero slides from API
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        setLoading(true);
        const data = await apiService.getHeroSlides();
        setSlides(data && data.length > 0 ? data : getDefaultSlides());
      } catch (error) {
        console.warn('Error fetching hero slides, using fallback:', error);
        setSlides(getDefaultSlides());
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % slides.length);
    }, 10000);

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollCue(false);
      } else {
        setShowScrollCue(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [slides.length]);

  // Default slides when API is not available
  const getDefaultSlides = (): HeroSlide[] => [
    {
      id: '1',
      title: 'AI Fashion Models for a Digital World',
      subtitle: 'Digital Innovation',
      description: 'Browse and download ready-to-use model packs — for campaigns, content, or training your own AI.',
      background_image_url: '',
      button_text: 'Browse Models',
      button_link: '/models',
      sort_order: 1,
      is_active: true
    },
    {
      id: '2',
      title: 'Download-Ready Model Packs',
      subtitle: 'Complete Packages',
      description: 'Each pack includes 30+ images and short videos — perfect for AI training, mockups, or content creation.',
      background_image_url: '',
      button_text: 'Browse Models',
      button_link: '/models',
      sort_order: 2,
      is_active: true
    },
    {
      id: '3',
      title: 'Built for Creators, Brands & AI Developers',
      subtitle: 'Professional Tools',
      description: 'From designers to marketers, anyone can train or feature their own AI model using our stylish assets.',
      background_image_url: '',
      button_text: 'Browse Models',
      button_link: '/models',
      sort_order: 3,
      is_active: true
    },
    {
      id: '4',
      title: 'A Continuously Evolving Model Roster',
      subtitle: 'Always Fresh',
      description: 'We\'re adding new AI-generated models weekly — across categories, ethnicities, and moods.',
      background_image_url: '',
      button_text: 'Browse Models',
      button_link: '/models',
      sort_order: 4,
      is_active: true
    }
  ];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDownloadDemo = () => {
    // TODO: Implement demo pack download
    alert('Demo pack download will be implemented soon!');
  };

  const scrollToContent = () => {
    const contentSection = document.getElementById('main-content');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getImageUrl = (slide: HeroSlide) => {
    return slide.background_image_url || '';
  };

  const handleButtonClick = (slide: HeroSlide) => {
    if (slide.button_link.startsWith('/')) {
      navigate(slide.button_link);
    } else {
      window.open(slide.button_link, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">CyberChicModels.ai</h1>
          <p className="text-lg text-gray-600 mb-8">AI-Generated Fashion Models</p>
          <button
            onClick={() => navigate('/models')}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Browse Models
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {getImageUrl(currentSlide) ? (
          <img
            src={getImageUrl(currentSlide)}
            alt={currentSlide.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-purple-100" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl mx-auto">
          {currentSlide.subtitle && (
            <p className="text-sm uppercase tracking-wider mb-4 text-rose-200">
              {currentSlide.subtitle}
            </p>
          )}
          <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
            {currentSlide.title}
          </h1>
          {currentSlide.description && (
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              {currentSlide.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleButtonClick(currentSlide)}
              className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium"
            >
              {currentSlide.button_text}
            </button>
            <button
              onClick={handleDownloadDemo}
              className="border border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-colors font-medium flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Demo Pack
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((current) => (current - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCurrentIndex((current) => (current + 1) % slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Cue */}
      {showScrollCue && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <button
            onClick={scrollToContent}
            className="text-white hover:text-rose-200 transition-colors"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
