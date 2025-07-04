'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminMarketplacePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    descriptionCourte: '',
    descriptionLongue: '',
    image: '',
    stock: 0,
    prix: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  console.log('AdminMarketplacePage rendered, isAdding:', isAdding, 'isEditing:', isEditing);

  useEffect(() => {
    console.log('AdminMarketplacePage useEffect - loading articles');
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        console.log('Articles loaded:', data.length);
      } else {
        setError('Erreur lors du chargement des articles');
      }
    } catch (error) {
      setError('Erreur de connexion');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.nom || !formData.type || !formData.descriptionCourte || !formData.descriptionLongue) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (formData.stock < 0) {
      setError('Le stock ne peut pas être négatif');
      return;
    }

    if (formData.prix < 0) {
      setError('Le prix ne peut pas être négatif');
      return;
    }

    try {
      if (isEditing) {
        // Modification
        const response = await fetch(`/api/articles/${isEditing}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSuccess('Article modifié avec succès');
          loadArticles();
          resetForm();
        } else {
          const data = await response.json();
          setError(data.error || 'Erreur lors de la modification');
        }
      } else {
        // Ajout
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSuccess('Article ajouté avec succès');
          loadArticles();
          resetForm();
        } else {
          const data = await response.json();
          setError(data.error || 'Erreur lors de l\'ajout');
        }
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  const handleDelete = async (articleId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Article supprimé avec succès');
          loadArticles();
        } else {
          const data = await response.json();
          setError(data.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        setError('Une erreur est survenue');
      }
    }
  };

  const handleEdit = (article: Article) => {
    console.log('handleEdit called for article:', article.id);
    setIsEditing(article.id);
    setIsAdding(false);
    setFormData({
      nom: article.nom,
      type: article.type,
      descriptionCourte: article.descriptionCourte,
      descriptionLongue: article.descriptionLongue,
      image: article.image,
      stock: article.stock,
      prix: article.prix
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      type: '',
      descriptionCourte: '',
      descriptionLongue: '',
      image: '',
      stock: 0,
      prix: 0
    });
    setIsEditing(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData({
      nom: '',
      type: '',
      descriptionCourte: '',
      descriptionLongue: '',
      image: '',
      stock: 0,
      prix: 0
    });
    setError('');
    setSuccess('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion du Marketplace
              </h1>
              <button
                onClick={handleAdd}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                + Ajouter un article
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Formulaire */}
            {(isAdding || isEditing) && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {isEditing ? 'Modifier l\'article' : 'Ajouter un article'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom de l'article
                      </label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                        placeholder="Ex: AK-47, M16, Glock 17..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type d'arme
                      </label>
                      <input
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                        placeholder="Ex: Fusil d'assaut, Pistolet, Sniper..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                        placeholder="Ex: 50"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Prix (€)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.prix}
                        onChange={(e) => setFormData({...formData, prix: parseFloat(e.target.value) || 0})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                        placeholder="Ex: 2500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        URL de l'image
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                        placeholder="Ex: /images/ak47.jpg ou URL complète"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description courte
                    </label>
                    <textarea
                      value={formData.descriptionCourte}
                      onChange={(e) => setFormData({...formData, descriptionCourte: e.target.value})}
                      rows={2}
                      className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                      placeholder="Description courte de l'arme (calibre, portée, etc.)"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description détaillée
                    </label>
                    <textarea
                      value={formData.descriptionLongue}
                      onChange={(e) => setFormData({...formData, descriptionLongue: e.target.value})}
                      rows={4}
                      className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                      placeholder="Description détaillée : caractéristiques techniques, historique, utilisation..."
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {isEditing ? 'Modifier' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste des articles */}
            <div className="bg-white shadow overflow-visible sm:rounded-md">
              <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {article.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {article.descriptionCourte}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {article.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : article.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {article.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(article.prix)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(article)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            title="Modifier l'article"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            title="Supprimer l'article"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 