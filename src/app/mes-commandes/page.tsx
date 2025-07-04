'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useUserOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { OrderStatus } from '@/types';

// Composant pour afficher le badge de statut
function StatusBadge({ status }: { status: OrderStatus }) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'En attente de validation':
        return { color: 'warning', text: 'En attente' };
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

// Composant pour afficher une commande dans la liste
function OrderCard({ order }: { order: any }) {
  const totalArticles = order.articles.reduce((sum: number, article: any) => sum + article.quantity, 0);
  const orderDate = new Date(order.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Commande {order.id}
          </h3>
          <p className="text-sm text-gray-500">
            {orderDate}
          </p>
        </div>
        <StatusBadge status={order.statut} />
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{totalArticles}</span> article{totalArticles > 1 ? 's' : ''} commandé{totalArticles > 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="flex justify-end">
        <Link
          href={`/mes-commandes/${order.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  );
}

export default function MesCommandesPage() {
  const { user } = useAuth();
  const { orders, loading, error } = useUserOrders(user?.id || 0);

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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Mes commandes
              </h1>
              <Link
                href="/marketplace"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Nouvelle commande
              </Link>
            </div>

            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Aucune commande
                </h2>
                <p className="text-gray-600 mb-6">
                  Vous n'avez pas encore passé de commande. Commencez par explorer notre marketplace.
                </p>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Aller au marketplace
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 