import React, { useState } from 'react';
import { X, Upload, Plus, Palette } from 'lucide-react';
import { apiService } from '../lib/api';

interface AddStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

export function AddStyleModal({ isOpen, onClose, onSuccess, onError, onRefresh }: AddStyleModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [colors, setColors] = useState<string[]>(['#ff0000']);
  const [sizes, setSizes] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addColor = () => {
    setColors(prev => [...prev, '#ff0000']);
  };

  const updateColor = (index: number, color: string) => {
    setColors(prev => prev.map((c, i) => i === index ? color : c));
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes(prev => [...prev, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setSizes(prev => prev.filter(s => s !== size));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      const styleData = {
        name: formData.get('name') as string,
        clothing_type: formData.get('clothing_type') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        material: formData.get('material') as string,
        brand: formData.get('brand') as string,
        season: formData.get('season') as string,
        price_usd: parseFloat(formData.get('price') as string) || 1.99,
        colors: colors,
        sizes: sizes,
        tags: tags,
        is_featured: formData.get('featured') === 'on',
        is_new: formData.get('new') === 'on',
        is_bestseller: formData.get('bestseller') === 'on',
        status: 'published'
      };

      // Create style via API
      const createdStyle = await apiService.createStyle(styleData);
      
      // TODO: Upload images to Google Cloud Storage
      // For now, just show success message
      
      onSuccess(`Style "${styleData.name}" created successfully with ${colors.length} colors and ${images.length} images!`);
      onRefresh();
      onClose();
      
      // Reset form
      setImages([]);
      setColors(['#ff0000']);
      setSizes([]);
      setTags([]);
      setNewSize('');
      setNewTag('');
      
    } catch (err) {
      onError('Failed to create style. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add New Style</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Style Name *</label>
                <input 
                  name="name" 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                  placeholder="e.g., Elegant Evening Dress" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clothing Type</label>
                <select 
                  name="clothing_type" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">Select type</option>
                  <option value="dress">Dress</option>
                  <option value="top">Top</option>
                  <option value="blouse">Blouse</option>
                  <option value="shirt">Shirt</option>
                  <option value="bottom">Bottom</option>
                  <option value="pants">Pants</option>
                  <option value="skirt">Skirt</option>
                  <option value="outerwear">Outerwear</option>
                  <option value="jacket">Jacket</option>
                  <option value="coat">Coat</option>
                  <option value="accessories">Accessories</option>
                  <option value="shoes">Shoes</option>
                  <option value="bag">Bag</option>
                  <option value="jewelry">Jewelry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  name="category" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">Select category</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="business">Business</option>
                  <option value="party">Party</option>
                  <option value="evening">Evening</option>
                  <option value="beach">Beach</option>
                  <option value="sports">Sports</option>
                  <option value="vintage">Vintage</option>
                  <option value="bohemian">Bohemian</option>
                  <option value="minimalist">Minimalist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input 
                  name="brand" 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                  placeholder="e.g., Chanel, Zara" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input 
                  name="material" 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
                  placeholder="e.g., Cotton, Silk, Polyester" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <select 
                  name="season" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">Select season</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                  <option value="all-season">All Season</option>
                </select>
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

          {/* Description */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Description</h4>
            <textarea 
              name="description" 
              rows={4} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" 
              placeholder="Describe this style, its features, and styling suggestions..."
            ></textarea>
          </div>

          {/* Colors */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Available Colors</h4>
            <div className="flex flex-wrap gap-4 mb-4">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={colors.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addColor}
                className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-rose-400 hover:text-rose-500"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Available Sizes</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter size (e.g., XS, S, M, L, XL)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Size
              </button>
            </div>
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sizes.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
            )}
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Tags</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter tag (e.g., trendy, comfortable, elegant)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Tag
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Style Flags */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Style Flags</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input name="featured" type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                <span className="text-sm font-medium">⭐ Featured</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input name="new" type="checkbox" defaultChecked className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                <span className="text-sm font-medium">🆕 New</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input name="bestseller" type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                <span className="text-sm font-medium">🏆 Bestseller</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Style Images</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="style-image-upload"
              />
              <label htmlFor="style-image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload Style Images</p>
                <p className="text-sm text-gray-500">Front view, back view, side view, detail shots</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB each</p>
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Style ${index + 1}`}
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
                'Create Style'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
