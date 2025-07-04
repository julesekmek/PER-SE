'use client';

import { useState, useEffect, useMemo } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CatalogueControls from '@/components/CatalogueControls';
import ArticleCard from '@/components/ArticleCard';
import EmptyState from '@/components/EmptyState';
import { Article } from '@/types';

type SortOption = 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc';
type ViewMode = 'grid' | 'list';

export default function CataloguePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour les filtres et tri
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        setError('Erreur lors du chargement des articles');
      }
    } catch (error) {
      setError('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  // Extraire tous les types uniques d'articles
  const availableTypes = useMemo(() => {
    const types = articles.map(article => article.type);
    return ['all', ...Array.from(new Set(types))];
  }, [articles]);

  // Filtrer et trier les articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;
    
    // Filtrage par type
    if (selectedType !== 'all') {
      filtered = articles.filter(article => article.type === selectedType);
    }
    
    // Tri
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.nom.localeCompare(b.nom);
        case 'name-desc':
          return b.nom.localeCompare(a.nom);
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [articles, selectedType, sortBy]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
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
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Contrôles de filtrage et tri */}
            <CatalogueControls
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