'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Article } from '@/types';
import { notFound } from 'next/navigation';

interface ArticleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Attendre les paramètres avec React.use()
  const resolvedParams = use(params);
  const articleId = resolvedParams.id;

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else if (response.status === 404) {
        notFound();
      } else {
        setError('Erreur lors du chargement de l\'article');
      }
    } catch (error) {
      setError('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

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

  if (!article) {
    notFound();
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Breadcrumb */}
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link
                    href="/catalogue"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                      {article.nom}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {article.nom}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Détails complets de l'article
                </p>
              </div>
              
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Type d'arme
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.type}
                      </span>
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Stock disponible
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : article.stock > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {article.stock} unité{article.stock > 1 ? 's' : ''}
                      </span>
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Description courte
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {article.descriptionCourte}
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Description détaillée
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {article.descriptionLongue}
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Image
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                        <div className="text-gray-500 text-center p-4">
                          <div className="text-6xl mb-2">🔫</div>
                          <p className="text-sm">Image non disponible</p>
                        </div>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Link
                href="/catalogue"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                ← Retour au marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 