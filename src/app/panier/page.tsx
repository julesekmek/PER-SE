'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import OrderProcessingLoader from '@/components/ui/OrderProcessingLoader';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useCart } from '@/contexts/CartContext';
import { useArticles } from '@/hooks/useArticles';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function PanierPage() {
  const { user } = useAuth();
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const { filteredAndSortedArticles } = useArticles('all', 'name-asc');
  const { createOrder, loading: creatingOrder, error: orderError } = useCreateOrder();
  const router = useRouter();
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Récupérer les articles du panier avec leurs détails
  const cartItemsWithDetails = state.items.map(item => {
    const article = filteredAndSortedArticles.find(a => a.id === item.articleId);
    return {
      ...item,
      article
    };
  }).filter(item => item.article); // Filtrer les articles non trouvés

  // Calculer le total
  const total = cartItemsWithDetails.reduce((sum, item) => {
    return sum + (item.article?.prix || 0) * item.quantity;
  }, 0);

  // Vérifier s'il y a des problèmes de stock
  const stockIssues = cartItemsWithDetails.filter(item => 
    item.quantity > (item.article?.stock || 0)
  );

  const canPlaceOrder = cartItemsWithDetails.length > 0 && stockIssues.length === 0;

  const handleQuantityChange = (articleId: number, newQuantity: number) => {
    updateQuantity(articleId, newQuantity);
  };

  const handleRemoveItem = (articleId: number) => {
    removeFromCart(articleId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handlePlaceOrder = async () => {
    if (!user || !canPlaceOrder) return;

    try {
      const order = await createOrder(user.id, state.items, filteredAndSortedArticles);
      
      if (order) {
        // Redirection immédiate vers la page de détail de la commande
        router.push(`/mes-commandes/${order.id}`);
        // Vider le panier après la redirection pour éviter de voir la page panier vide
        setTimeout(() => {
          clearCart();
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
    }
  };

  if (cartItemsWithDetails.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Panier
              </h1>
              
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Votre panier est vide
                </h2>
                <p className="text-gray-600 mb-6">
                  Ajoutez des articles depuis le marketplace pour commencer vos achats.
                </p>
                <Button
                  onClick={() => router.push('/marketplace')}
                  variant="primary"
                >
                  Aller au marketplace
                </Button>
              </div>
            </div>
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
                Panier ({state.totalItems} article{state.totalItems > 1 ? 's' : ''})
              </h1>
              <Button
                onClick={handleClearCart}
                variant="secondary"
                className="text-red-600 hover:text-red-700"
              >
                Vider le panier
              </Button>
            </div>

            {orderError && (
              <Alert type="error" className="mb-6">
                {orderError}
              </Alert>
            )}



            {stockIssues.length > 0 && (
              <Alert type="error" className="mb-6">
                <div>
                  <strong>Problèmes de stock détectés :</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {stockIssues.map(item => (
                      <li key={item.articleId}>
                        {item.article?.nom} : quantité demandée ({item.quantity}) > stock disponible ({item.article?.stock})
                      </li>
                    ))}
                  </ul>
                </div>
              </Alert>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {cartItemsWithDetails.map((item) => (
                  <li key={item.articleId} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-2xl">🔫</div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.article?.nom}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.article?.descriptionCourte}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="default">{item.article?.type}</Badge>
                            <Badge 
                              variant={item.article && item.quantity > item.article.stock ? 'danger' : 'success'}
                            >
                              Stock: {item.article?.stock}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`quantity-${item.articleId}`} className="text-sm font-medium text-gray-700">
                            Quantité:
                          </label>
                          <input
                            id={`quantity-${item.articleId}`}
                            type="number"
                            min="1"
                            max={item.article?.stock || 1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.articleId, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 px-2 py-1 border-2 border-gray-400 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50 transition-colors"
                            aria-label={`Quantité pour ${item.article?.nom} (max: ${item.article?.stock})`}
                            title={`Sélectionnez la quantité pour ${item.article?.nom} (maximum: ${item.article?.stock})`}
                          />
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {formatPrice((item.article?.prix || 0) * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.article?.prix || 0)} l'unité
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleRemoveItem(item.articleId)}
                          variant="secondary"
                          className="text-red-600 hover:text-red-700"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {creatingOrder ? (
              <div className="mt-8">
                <OrderProcessingLoader 
                  message="Votre commande est en cours de création..."
                  className="w-full"
                />
              </div>
            ) : (
              <div className="mt-8 bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Récapitulatif
                    </h3>
                    <div className="text-2xl font-bold text-gray-900">
                      Total: {formatPrice(total)}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      onClick={() => router.push('/marketplace')}
                      variant="secondary"
                    >
                      Continuer les achats
                    </Button>
                    
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={!canPlaceOrder}
                      variant="primary"
                      className="min-w-[150px]"
                    >
                      Passer la commande
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 