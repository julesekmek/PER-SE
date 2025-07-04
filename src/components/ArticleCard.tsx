import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  viewMode: 'grid' | 'list';
}

export default function ArticleCard({ article, viewMode }: ArticleCardProps) {
  const getStockColor = (stock: number) => {
    if (stock > 10) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (viewMode === 'grid') {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-center p-4">
            <div className="text-4xl mb-2">🔫</div>
            <p className="text-sm">{article.nom}</p>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {article.nom}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {article.type}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockColor(article.stock)}`}>
              Stock: {article.stock}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {article.descriptionCourte}
          </p>

          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(article.prix)}
            </span>
          </div>
          
          <Link
            href={`/marketplace/${article.id}`}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-auto"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    );
  }

  // Mode liste
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-200 flex items-center justify-center flex-shrink-0">
          <div className="text-gray-500 text-center p-4">
            <div className="text-4xl mb-2">🔫</div>
            <p className="text-sm">{article.nom}</p>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {article.nom}
              </h3>
              <p className="text-gray-600 mb-4">
                {article.descriptionCourte}
              </p>
            </div>
            
            <div className="flex flex-col sm:items-end gap-2 mb-4 sm:mb-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {article.type}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockColor(article.stock)}`}>
                Stock: {article.stock}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(article.prix)}
            </span>
          </div>
          
          <Link
            href={`/marketplace/${article.id}`}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </div>
  );
} 