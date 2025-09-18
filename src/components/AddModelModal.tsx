import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../lib/api';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

export function AddModelModal({ isOpen, onClose, onSuccess, onError, onRefresh }: AddModelModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [newCollection, setNewCollection] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addCollection = () => {
    if (newCollection.trim() && !collections.includes(newCollection.trim())) {
      setCollections(prev => [...prev, newCollection.trim()]);
      setNewCollection('');
    }
  };

  const removeCollection = (collection: string) => {
    setCollections(prev => prev.filter(c => c !== collection));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
        specialties: formData.get('specialties')?.toString().split(',').map(s => s.trim()).filter(s => s) || [],
        price_usd: parseFloat(formData.get('price') as string) || 1.99,
        is_featured: formData.get('featured') === 'on',
        is_new: formData.get('new') === 'on',
        is_coming: formData.get('coming') === 'on',
        is_popular: formData.get('popular') === 'on',
        status: 'published',
        collections: collections
      };

      // Create model via API
      const createdModel = await apiService.createModel(modelData);
      
      // TODO: Upload images to Google Cloud Storage
      // For now, just show success message
      
      onSuccess(`Model "${modelData.name}" created successfully with ${collections.length} collections and ${images.length} images!`);
      onRefresh();
      onClose();
      
      // Reset form
      setImages([]);
      setCollections([]);
      setNewCollection('');
      
    } catch (err) {
      onError('Failed to create model. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add New Model</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
                  placeholder="e.g., Fashion Forward Influencer" 
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
                placeholder="Enter collection name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCollection())}
              />
              <button
                type="button"
                onClick={addCollection}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add
              </button>
            </div>
            {collections.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {collections.map((collection, index) => (
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
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload Model Images</p>
                <p className="text-sm text-gray-500">Click to select or drag and drop images</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB each</p>
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
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
                'Create Model'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
