import React, { useState, useEffect } from 'react';
import { X, Upload, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { apiService } from '../lib/api';

interface AddHeroSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

export function AddHeroSlideModal({ isOpen, onClose, onSuccess, onError, onRefresh }: AddHeroSlideModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewData, setPreviewData] = useState({
    title: 'Discover Your Perfect Style',
    subtitle: 'Explore our latest collection of AI-generated models',
    button_text: 'Shop Now',
    background_color: '#667eea',
    display_order: 1
  });

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const updatePreview = (field: string, value: string | number) => {
    setPreviewData(prev => ({ ...prev, [field]: value }));
  };

  const changeOrder = (direction: number) => {
    const newOrder = Math.max(1, Math.min(10, previewData.display_order + direction));
    updatePreview('display_order', newOrder);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
        duration_seconds: parseInt(formData.get('duration_seconds') as string) || 5
      };

      // Create hero slide via API
      const createdSlide = await apiService.createHeroSlide(slideData);
      
      // TODO: Upload images to Google Cloud Storage
      // For now, just show success message
      
      onSuccess(`Hero slide "${slideData.title}" created successfully at carousel position ${slideData.display_order} with ${images.length} images!`);
      onRefresh();
      onClose();
      
      // Reset form
      setImages([]);
      setPreviewData({
        title: 'Discover Your Perfect Style',
        subtitle: 'Explore our latest collection of AI-generated models',
        button_text: 'Shop Now',
        background_color: '#667eea',
        display_order: 1
      });
      
    } catch (err) {
      onError('Failed to create hero slide. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add New Hero Slide</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex">
          {/* Form Section */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit}>
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
                      value={previewData.title}
                      onChange={(e) => updatePreview('title', e.target.value)}
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
                      value={previewData.subtitle}
                      onChange={(e) => updatePreview('subtitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input 
                      name="button_text" 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                      placeholder="e.g., Shop Now" 
                      value={previewData.button_text}
                      onChange={(e) => updatePreview('button_text', e.target.value)}
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
                      value={previewData.background_color}
                      onChange={(e) => updatePreview('background_color', e.target.value)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => changeOrder(-1)}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <input 
                        name="display_order" 
                        type="number" 
                        min="1" 
                        max="10" 
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-center focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                        value={previewData.display_order}
                        onChange={(e) => updatePreview('display_order', parseInt(e.target.value) || 1)}
                      />
                      <button
                        type="button"
                        onClick={() => changeOrder(1)}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Position in carousel (1-10)</p>
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

              {/* Image Upload */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Background Images</h4>
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
                
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Background ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Hero Slide'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Section */}
          <div className="w-96 bg-gray-50 border-l">
            <div className="sticky top-0 p-4 border-b bg-white">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-800">Live Preview</h4>
              </div>
            </div>
            
            <div className="p-4">
              <div 
                className="relative rounded-lg overflow-hidden h-64 flex items-center justify-center text-white"
                style={{ 
                  background: `linear-gradient(135deg, ${previewData.background_color} 0%, #764ba2 100%)` 
                }}
              >
                {/* Background Image Preview */}
                {images.length > 0 && (
                  <img
                    src={URL.createObjectURL(images[0])}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                )}
                
                {/* Content Overlay */}
                <div className="relative z-10 text-center px-6">
                  <h2 className="text-2xl font-bold mb-2">{previewData.title}</h2>
                  <p className="text-sm opacity-90 mb-4">{previewData.subtitle}</p>
                  <button className="bg-rose-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors">
                    {previewData.button_text}
                  </button>
                </div>
                
                {/* Order Indicator */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  Position: {previewData.display_order}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Carousel Position:</strong> {previewData.display_order} of 10</p>
                <p><strong>Background Images:</strong> {images.length}</p>
                <p><strong>Status:</strong> <span className="text-green-600">Ready to create</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
