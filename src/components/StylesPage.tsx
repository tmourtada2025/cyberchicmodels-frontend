import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { ArrowLeft, X, Search, RefreshCw } from 'lucide-react';
import { Footer } from './Footer';
import { apiService } from '../lib/api';
import type { Style } from '../lib/api';

interface FilterState {
  clothingType: string[];
  styleTheme: string[];
  colorTags: string[];
  search: string;
}

interface ColorTag {
  value: string;
  description: string;
}

export function StylesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [styles, setStyles] = useState<Style[]>([]);
  const [filteredStyles, setFilteredStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    clothingType: [] as string[],
    styleTheme: [] as string[],
    colorTags: [] as ColorTag[]
  });
  const [filters, setFilters] = useState<FilterState>({
    clothingType: [],
    styleTheme: [],
    colorTags: [],
    search: ""
  });
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Fetch styles from API
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getStyles({ limit: 100 });
        setStyles(data);
        setFilteredStyles(data);
        
        // Extract filter options from the data
        const clothingTypes = [...new Set(data.map(style => style.clothing_type).filter(Boolean))].sort();
        const styleThemes = [...new Set(data.map(style => style.style_theme).filter(Boolean))].sort();
        const allColors = new Set<string>();
        
        data.forEach(style => {
          if (style.colors && Array.isArray(style.colors)) {
            style.colors.forEach(color => allColors.add(color));
          }
        });
        
        const colorTags = Array.from(allColors).map(color => ({
          value: color,
          description: color
        })).sort((a, b) => a.value.localeCompare(b.value));

        setFilterOptions({
          clothingType: clothingTypes,
          styleTheme: styleThemes,
          colorTags
        });

      } catch (err) {
        console.error('Error fetching styles:', err);
        setError('Failed to load styles');
        setStyles([]);
        setFilteredStyles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...styles];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(style =>
        style.name.toLowerCase().includes(searchTerm) ||
        style.description?.toLowerCase().includes(searchTerm) ||
        style.clothing_type?.toLowerCase().includes(searchTerm) ||
        style.style_theme?.toLowerCase().includes(searchTerm)
      );
    }

    // Clothing type filter
    if (filters.clothingType.length > 0) {
      filtered = filtered.filter(style =>
        style.clothing_type && filters.clothingType.includes(style.clothing_type)
      );
    }

    // Style theme filter
    if (filters.styleTheme.length > 0) {
      filtered = filtered.filter(style =>
        style.style_theme && filters.styleTheme.includes(style.style_theme)
      );
    }

    // Color filter
    if (filters.colorTags.length > 0) {
      filtered = filtered.filter(style =>
        style.colors && style.colors.some(color => filters.colorTags.includes(color))
      );
    }

    setFilteredStyles(filtered);
  }, [styles, filters]);

  const handleFilterChange = (filterType: keyof FilterState, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFilter = (filterType: 'clothingType' | 'styleTheme' | 'colorTags', value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      clothingType: [],
      styleTheme: [],
      colorTags: [],
      search: ""
    });
  };

  const handleAddToCart = (style: Style) => {
    dispatch(addToCart({
      id: style.id,
      name: style.name,
      price: style.price_usd || 1.99,
      image: style.image_url || '',
      type: 'style'
    }));
  };

  const handleStyleClick = (style: Style) => {
    navigate(`/style/${style.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="py-12 px-4 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-serif mb-4">Digital Styles & Couture</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover our collection of AI-generated fashion styles. Each style comes with multiple angles and color variations perfect for your design projects.
          </p>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search styles..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Clothing Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Clothing Type
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.clothingType.map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.clothingType.includes(type)}
                            onChange={() => toggleFilter('clothingType', type)}
                            className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Style Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Style Theme
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.styleTheme.map(theme => (
                        <label key={theme} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.styleTheme.includes(theme)}
                            onChange={() => toggleFilter('styleTheme', theme)}
                            className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{theme}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Colors
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {filterOptions.colorTags.map(colorTag => (
                        <button
                          key={colorTag.value}
                          onClick={() => toggleFilter('colorTags', colorTag.value)}
                          onMouseEnter={() => setHoveredColor(colorTag.value)}
                          onMouseLeave={() => setHoveredColor(null)}
                          className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                            filters.colorTags.includes(colorTag.value)
                              ? 'border-rose-500 scale-110'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: colorTag.value.toLowerCase() }}
                          title={colorTag.description}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Styles Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredStyles.length} of {styles.length} styles
                </p>
              </div>

              {filteredStyles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No styles found matching your criteria</p>
                  <button
                    onClick={clearFilters}
                    className="text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    Clear filters to see all styles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredStyles.map(style => (
                    <div key={style.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div 
                        className="aspect-square bg-gray-100 cursor-pointer"
                        onClick={() => handleStyleClick(style)}
                      >
                        {style.image_url ? (
                          <img
                            src={style.image_url}
                            alt={style.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span>No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{style.name}</h3>
                        {style.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{style.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-rose-500">
                            ${style.price_usd?.toFixed(2) || '1.99'}
                          </span>
                          <button
                            onClick={() => handleAddToCart(style)}
                            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm"
                          >
                            Add to Cart
                          </button>
                        </div>
                        {style.colors && style.colors.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {style.colors.slice(0, 5).map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              />
                            ))}
                            {style.colors.length > 5 && (
                              <span className="text-xs text-gray-500 ml-1">
                                +{style.colors.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
