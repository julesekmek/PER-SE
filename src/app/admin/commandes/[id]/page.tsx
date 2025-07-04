'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import { getOrderById, updateOrderStatus } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { OrderStatus } from '@/types';
import { getArticles } from '@/hooks/useArticles';

// Composant pour afficher le badge de statut
function StatusBadge({ status }: { status: OrderStatus }) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'En attente de validation':
        return { color: 'warning', text: 'En attente de validation' };
      case 'En cours':
        return { color: 'primary', text: 'En cours' };
      case 'Expédié':
        return { color: 'info', text: 'Expédié' };
      case 'Reçu':
        return { color: 'success', text: 'Reçu' };
      default:
        return { color: 'default', text: status };
    }
  };

  const config = getStatusConfig(status);
  return <Badge variant={config.color as any}>{config.text}</Badge>;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, articlesData] = await Promise.all([
          getOrderById(params.id as string),
          getArticles()
        ]);
        
        setOrder(orderData);
        setArticles(articlesData);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Vérifier que l'utilisateur est admin
  if (user?.role !== 'admin') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <Alert type="error">
                Accès refusé. Vous devez être administrateur pour accéder à cette page.
              </Alert>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </ProtectedRoute>
    );
  }



  if (!order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h1>
            <Link
              href="/admin/commandes"
              className="text-blue-600 hover:text-blue-800"
            >
              Retour à la gestion des commandes
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Fonction pour récupérer le prix d'un article
  const getArticlePrice = (articleId: number) => {
    const article = articles.find(a => a.id === articleId);
    return article?.prix || 0;
  };

  // Fonction pour récupérer le prix d'un article dans la commande
  const getOrderArticlePrice = (orderArticle: any) => {
    // Si le prix est déjà dans la commande, l'utiliser
    if (orderArticle.prix !== undefined) {
      return orderArticle.prix;
    }
    // Sinon, le récupérer depuis la base de données des articles
    return getArticlePrice(orderArticle.articleId);
  };

  const orderDate = new Date(order.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalArticles = order.articles.reduce((sum: number, article: any) => sum + article.quantity, 0);
  const totalPrice = order.articles.reduce((sum: number, article: any) => {
    const prix = getOrderArticlePrice(article);
    return sum + (prix * article.quantity);
  }, 0);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const success = await updateOrderStatus(order.id, newStatus);
      if (success) {
        // Mettre à jour l'état local
        setOrder({ ...order, statut: newStatus });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions: OrderStatus[] = [
    'En attente de validation',
    'En cours',
    'Expédié',
    'Reçu'
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* En-tête */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Link
                    href="/admin/commandes"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mb-4"
                  >
                    ← Retour à la gestion des commandes
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Commande {order.id}
                  </h1>
                </div>
                <StatusBadge status={order.statut} />
              </div>
            </div>

            {/* Informations de la commande */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations de la commande
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Numéro de commande</p>
                  <p className="text-lg text-gray-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de commande</p>
                  <p className="text-lg text-gray-900">{orderDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Utilisateur</p>
                  <p className="text-lg text-gray-900">Utilisateur #{order.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre d'articles</p>
                  <p className="text-lg text-gray-900">{totalArticles}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut actuel</p>
                  <div className="mt-1">
                    <StatusBadge status={order.statut} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total de la commande</p>
                  <p className="text-lg font-bold text-gray-900">{totalPrice.toFixed(2)} €</p>
                </div>
              </div>
            </div>

            {/* Gestion du statut */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Gestion du statut
              </h2>
              
              <div className="flex items-center space-x-4">
                <label htmlFor="status-select" className="text-sm font-medium text-gray-700">
                  Nouveau statut:
                </label>
                <select
                  id="status-select"
                  value={order.statut}
                  onChange={(e) => handleStatusUpdate(e.target.value as OrderStatus)}
                  disabled={isUpdating}
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {isUpdating && (
                  <div className="flex items-center text-sm text-gray-500">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Mise à jour...
                  </div>
                )}
              </div>
            </div>

            {/* Liste des articles avec prix */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Articles commandés
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix unitaire
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.articles.map((article: any, index: number) => {
                      const prix = getOrderArticlePrice(article);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="text-lg">🔫</div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {article.nom}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Stock au moment de la commande: {article.stock}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">
                            {article.quantity}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">
                            {prix.toFixed(2)} €
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                            {(prix * article.quantity).toFixed(2)} €
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Récapitulatif des prix */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Total ({totalArticles} article{totalArticles > 1 ? 's' : ''})
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {totalPrice.toFixed(2)} €
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-between">
              <Link
                href="/admin/commandes"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Retour à la gestion des commandes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 