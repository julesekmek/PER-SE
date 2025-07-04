'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { useAllOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { OrderStatus } from '@/types';

// Composant Modal de confirmation
function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger';
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
            type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <div className={`text-2xl ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`}>
              {type === 'danger' ? '⚠️' : '⚠️'}
            </div>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
            {title}
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
          <div className="flex justify-center space-x-3 mt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-4 py-2"
            >
              {cancelText}
            </Button>
            <Button
              variant={type === 'danger' ? 'danger' : 'warning'}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher une commande dans le tableau
function OrderRow({ 
  order, 
  onUpdateStatus, 
  onDeleteOrder,
  users,
  onShowDeleteModal
}: { 
  order: any; 
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  users: any[];
  onShowDeleteModal: (orderId: string) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const totalArticles = order.articles.reduce((sum: number, article: any) => sum + article.quantity, 0);
  const orderDate = new Date(order.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Trouver l'utilisateur correspondant
  const user = users.find(u => u.id === order.userId);
  const userName = user ? user.nom : `Utilisateur #${order.userId}`;

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(order.id, newStatus);
    setIsUpdating(false);
  };

  const statusOptions: OrderStatus[] = [
    'En attente de validation',
    'En cours',
    'Expédié',
    'Reçu'
  ];

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <Link
          href={`/admin/commandes/${order.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {order.id}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {orderDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {userName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {totalArticles} article{totalArticles > 1 ? 's' : ''}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
        <select
          value={order.statut}
          onChange={(e) => handleStatusUpdate(e.target.value as OrderStatus)}
          disabled={isUpdating}
          className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
          style={{ zIndex: 50 }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-md">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          <Link
            href={`/admin/commandes/${order.id}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            title="Modifier la commande"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => onShowDeleteModal(order.id)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            title="Supprimer la commande"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminCommandesPage() {
  const { user } = useAuth();
  const { orders, loading, error, updateOrderStatus } = useAllOrders();
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    };

    loadUsers();
  }, []);

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

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        setUpdateMessage({
          type: 'success',
          message: 'Statut mis à jour avec succès'
        });
      } else {
        setUpdateMessage({
          type: 'error',
          message: 'Erreur lors de la mise à jour du statut'
        });
      }
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        message: 'Erreur lors de la mise à jour du statut'
      });
    }

    // Masquer le message après 3 secondes
    setTimeout(() => {
      setUpdateMessage(null);
    }, 3000);
  };

  const handleShowDeleteModal = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      // Charger les commandes actuelles
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }
      
      const allOrders = await response.json();
      const updatedOrders = allOrders.filter((order: any) => order.id !== orderToDelete);
      
      // Sauvegarder les commandes mises à jour
      const saveResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrders),
      });
      
      if (saveResponse.ok) {
        setUpdateMessage({
          type: 'success',
          message: 'Commande supprimée avec succès'
        });
        // Recharger la page pour mettre à jour la liste
        window.location.reload();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        message: 'Erreur lors de la suppression de la commande'
      });
    }

    // Masquer le message après 3 secondes
    setTimeout(() => {
      setUpdateMessage(null);
    }, 3000);
  };

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
                Gestion des commandes
              </h1>
            </div>

            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            {updateMessage && (
              <Alert type={updateMessage.type} className="mb-6">
                {updateMessage.message}
              </Alert>
            )}

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Aucune commande
                </h2>
                <p className="text-gray-600">
                  Aucune commande n'a été passée pour le moment.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-visible sm:rounded-md">
                <div className="overflow-x-auto overflow-y-visible">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commande
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Articles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          onUpdateStatus={handleUpdateStatus}
                          onDeleteOrder={handleDeleteOrder}
                          users={users}
                          onShowDeleteModal={handleShowDeleteModal}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal de confirmation en dehors du tableau */}
            <ConfirmationModal
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setOrderToDelete(null);
              }}
              onConfirm={handleDeleteOrder}
              title="Supprimer la commande"
              message={`Êtes-vous sûr de vouloir supprimer la commande ${orderToDelete} ? Cette action est irréversible.`}
              confirmText="Supprimer"
              cancelText="Annuler"
              type="danger"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 