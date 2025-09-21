import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Heart, Star, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import { addLike } from '../store/likesSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import { RootState } from '../store/store';
import type { Model } from '../lib/api-simple'; // Import Model interface

interface ModelDetailModalProps {
  model: Model; // Use the Model interface directly
  allModels?: Model[]; // Use the Model interface directly
  onClose: () => void;
  onModelChange?: (model: Model) => void;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  photos: string[]; // Array of image URLs
}

export function ModelDetailModal({ model, allModels = [], onClose, onModelChange }: ModelDetailModalProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const likes = useSelector((state: RootState) => state.likes.likes[model.id] || 0);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.id === model.id);

  useEffect(() => {
    const newCollections: Collection[] = [];

    // Main Photos Collection
    if (model.main_photos && model.main_photos.length > 0) {
      newCollections.push({
        id: 'main',
        name: 'Main Photos',
        photos: model.main_photos,
      });
    }

    // Editorial Photos Collection
    if (model.editorial_photos && model.editorial_photos.length > 0) {
      newCollections.push({
        id: 'editorial',
        name: 'Editorial',
        photos: model.editorial_photos,
      });
    }

    // Commercial Photos Collection
    if (model.commercial_photos && model.commercial_photos.length > 0) {
      newCollections.push({
        id: 'commercial',
        name: 'Commercial',
        photos: model.commercial_photos,
      });
    }

    // Runway Photos Collection
    if (model.runway_photos && model.runway_photos.length > 0) {
      newCollections.push({
        id: 'runway',
        name: 'Runway',
        photos: model.runway_photos,
      });
    }

    setCollections(newCollections);
    setCurrentCollectionIndex(0); // Start with the first collection
    setCurrentPhotoIndex(0); // Start with the first photo in the first collection
    setLoading(false);
  }, [model]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentCollectionIndex, currentPhotoIndex, collections]);

  const handlePrevPhoto = () => {
    const currentCollectionPhotos = collections[currentCollectionIndex]?.photos || [];
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (currentCollectionIndex > 0) {
      // Go to last photo of previous collection
      setCurrentCollectionIndex(currentCollectionIndex - 1);
      setCurrentPhotoIndex((collections[currentCollectionIndex - 1]?.photos || []).length - 1);
    }
  };

  const handleNextPhoto = () => {
    const currentCollectionPhotos = collections[currentCollectionIndex]?.photos || [];
    if (currentPhotoIndex < currentCollectionPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else if (currentCollectionIndex < collections.length - 1) {
      // Go to first photo of next collection
      setCurrentCollectionIndex(currentCollectionIndex + 1);
      setCurrentPhotoIndex(0);
    }
  };

  const handleCollectionChange = (index: number) => {
    setCurrentCollectionIndex(index);
    setCurrentPhotoIndex(0); // Always start with the first photo of the selected collection
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: model.id,
      name: model.name,
      price: model.price_usd,
      image: model.thumbnail_url,
      specialty: model.specialties[0] || '', // Use first specialty for cart display
    }));
    setIsAdded(true);
  };

  const handleLike = () => {
    if (!hasLiked) {
      dispatch(addLike(model.id));
      setHasLiked(true);
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite({
      id: model.id,
      name: model.name,
      image: model.thumbnail_url,
      specialty: model.specialties[0] || '',
    }));
  };

  const handleBackToModels = () => {
    onClose();
    navigate('/models');
  };

  const handleNavigateModel = (direction: 'previous' | 'next') => {
    if (allModels.length === 0) return;
    
    const currentIndex = allModels.findIndex(m => m.id === model.id);
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === 'previous') {
      nextIndex = currentIndex === 0 ? allModels.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex === allModels.length - 1 ? 0 : currentIndex + 1;
    }
    
    const nextModel = allModels[nextIndex];
    if (nextModel && onModelChange) {
      onModelChange(nextModel);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading model details...</p>
        </div>
      </div>
    );
  }

  const currentCollectionData = collections[currentCollectionIndex];
  const currentImage = currentCollectionData?.photos[currentPhotoIndex] || model.thumbnail_url;
  
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

        {/* Navigation Pills - Top center of image area */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex space-x-4">
          <button
            onClick={() => handleNavigateModel('previous')}
            className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-white transition-all duration-200 flex items-center text-gray-800 shadow-lg hover:shadow-xl text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Model
          </button>
          <button
            onClick={() => handleNavigateModel('next')}
            className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-white transition-all duration-200 flex items-center text-gray-800 shadow-lg hover:shadow-xl text-sm"
          >
            Next Model
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          {/* Image Section */}
          <div className="lg:col-span-2 relative bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full h-full flex items-center justify-center max-h-[85vh]">
              <img
                src={currentImage}
                alt={model.name}
                className="max-w-[90%] max-h-[75vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
              disabled={currentCollectionIndex === 0 && currentPhotoIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 text-gray-800" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
              disabled={currentCollectionIndex === collections.length - 1 && currentPhotoIndex === (currentCollectionData?.photos.length || 1) - 1}
            >
              <ChevronRight className="h-4 w-4 text-gray-800" />
            </button>

            {/* Photo Counter */}
            {collections.length > 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full text-gray-800 text-sm shadow-lg font-medium">
                {currentPhotoIndex + 1} / {currentCollectionData?.photos.length || 1}
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-20 right-6 flex space-x-3">
              <button
                onClick={handleLike}
                className={`bg-white/95 backdrop-blur-sm p-3 rounded-full transition-all duration-200 flex items-center shadow-lg hover:shadow-xl hover:scale-110 ${
                  hasLiked ? 'cursor-default' : 'hover:bg-white'
                }`}
                disabled={hasLiked}
              >
                <Heart className={`h-5 w-5 ${hasLiked ? 'text-red-500 fill-red-500' : 'text-gray-800'}`} />
                <span className="ml-1 text-gray-800">{likes}</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className="bg-white/95 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <Star className={`h-5 w-5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'}`} />
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif mb-2">{model.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{model.tagline || model.specialties[0]}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Age:</span> {model.age}</p>
                  <p><span className="font-medium">Nationality:</span> {model.nationality}</p>
                  <p><span className="font-medium">Ethnicity:</span> {model.ethnicity}</p>
                  <p><span className="font-medium">Gender:</span> {model.gender}</p>
                  <p><span className="font-medium">Height:</span> {model.height}</p>
                  <p><span className="font-medium">Weight:</span> {model.weight}</p>
                </div>
              </div>

              {/* Collections Tabs */}
              {collections.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">
                    Photo Collections 
                    <span className="text-sm text-gray-500 ml-2">
                      ({collections.reduce((acc, col) => acc + col.photos.length, 0)} photos total)
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((collection, index) => (
                      <button
                        key={collection.id}
                        onClick={() => handleCollectionChange(index)}
                        className={`px-4 py-2 rounded-full text-sm transition ${
                          currentCollectionIndex === index
                            ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {collection.name} ({collection.photos.length})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {model.bio && (
                <div>
                  <h3 className="font-medium mb-2">Bio</h3>
                  <p className="text-gray-700 text-sm">{model.bio}</p>
                </div>
              )}

              {/* Hobbies */}
              {model.hobbies && (
                <div>
                  <h3 className="font-medium mb-2">Hobbies</h3>
                  <p className="text-gray-700 text-sm">{model.hobbies}</p>
                </div>
              )}

              {/* Specialties */}
              {model.specialties && model.specialties.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {model.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Actions */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-2xl font-bold mb-3">${model.price_usd.toFixed(2)}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 px-6 py-3 rounded-full text-white font-semibold transition-all duration-200 ${
                      isAdded ? 'bg-green-600 cursor-default' : 'bg-black hover:bg-gray-800'
                    }`}
                    disabled={isAdded}
                  >
                    {isAdded ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                  <button className="flex-1 px-6 py-3 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-all duration-200">
                    Preview Pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

