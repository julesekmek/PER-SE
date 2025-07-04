'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MarketplaceControls from '@/components/MarketplaceControls';
import ArticleCard from '@/components/ArticleCard';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { useArticles } from '@/hooks/useArticles';

type SortOption = 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc' | 'price-asc' | 'price-desc';
type ViewMode = 'grid' | 'list';

export default function MarketplacePage() {
  // États pour les filtres et tri
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const {
    loading,
    error,
    filteredAndSortedArticles,
    availableTypes,
  } = useArticles(selectedType, sortBy);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Marketplace
            </h1>
            
            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            {/* Contrôles de filtrage et tri */}
            <MarketplaceControls
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              availableTypes={availableTypes}
              filteredCount={filteredAndSortedArticles.length}
            />
            
            {/* Affichage des articles */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} viewMode={viewMode} />
                ))}
              </div>
            )}
            
            {filteredAndSortedArticles.length === 0 && !error && (
              <EmptyState 
                selectedType={selectedType} 
                onResetFilter={() => setSelectedType('all')} 
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 