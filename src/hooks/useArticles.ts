import { useState, useEffect, useMemo } from 'react';
import { Article } from '@/types';

type SortOption = 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc' | 'price-asc' | 'price-desc';

interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
  filteredAndSortedArticles: Article[];
  availableTypes: string[];
}

export function useArticles(
  selectedType: string = 'all',
  sortBy: SortOption = 'name-asc'
): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        setError('Erreur lors du chargement des articles');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

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
        case 'price-asc':
          return a.prix - b.prix;
        case 'price-desc':
          return b.prix - a.prix;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [articles, selectedType, sortBy]);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
    filteredAndSortedArticles,
    availableTypes,
  };
} 