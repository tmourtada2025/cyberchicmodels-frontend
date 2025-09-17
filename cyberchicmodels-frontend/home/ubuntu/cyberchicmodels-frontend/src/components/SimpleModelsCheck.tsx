import React, { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import type { Model } from '../lib/supabase';

export function SimpleModelsCheck() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        // For now, return empty array since backend isn't ready
        // const data = await apiService.getModels({ limit: 10 });
        // setModels(data);
        setModels([]);
        setError(null);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to fetch models');
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Backend API not yet connected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif mb-8 text-center">Models Check</h1>
        
        {models.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No models found</p>
            <p className="text-sm text-gray-500">
              This page will display models once the backend API is connected
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map((model) => (
              <div key={model.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
                  {model.tagline && (
                    <p className="text-gray-600 mb-4">{model.tagline}</p>
                  )}
                  <div className="space-y-2 text-sm text-gray-500">
                    {model.nationality && (
                      <p><span className="font-medium">Nationality:</span> {model.nationality}</p>
                    )}
                    {model.age && (
                      <p><span className="font-medium">Age:</span> {model.age}</p>
                    )}
                    {model.height && (
                      <p><span className="font-medium">Height:</span> {model.height}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
