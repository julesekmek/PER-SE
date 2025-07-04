import React, { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Button from '@/components/ui/Button';

interface ArticleCardProps {
  article: Article;
  viewMode: 'grid' | 'list';
}

function ArticleImage({ article }: { article: Article }) {
  return (
    <div className="h-48 bg-gray-200 flex items-center justify-center">
      <div className="text-gray-500 text-center p-4">
        <div className="text-4xl mb-2">🔫</div>
        <p className="text-sm">{article.nom}</p>
      </div>
    </div>
  );
}

function ArticleBadges({ article }: { article: Article }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <Badge variant="default">{article.type}</Badge>
      <Badge variant={article.stock > 10 ? 'success' : article.stock > 0 ? 'warning' : 'danger'}>
        Stock: {article.stock}
      </Badge>
    </div>
  );
}

function ArticlePrice({ price }: { price: number }) {
  return (
    <div className="mb-4">
      <span className="text-2xl font-bold text-gray-900">
        {formatPrice(price)}
      </span>
    </div>
  );
}

function AddToCartButton({ article }: { article: Article }) {
  const { addToCart, getItemQuantity, isInCart } = useCart();
  const { showNotification } = useNotifications();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity <= 0) {
      showNotification('error', 'La quantité doit être supérieure à 0');
      return;
    }

    if (quantity > article.stock) {
      showNotification('error', `Stock insuffisant. Disponible: ${article.stock}`);
      return;
    }

    addToCart(article.id, quantity);
    showNotification('success', `${quantity} article(s) ajouté(s) au panier`);
    setQuantity(1);
  };

  const currentQuantity = getItemQuantity(article.id);
  const isInCartCurrently = isInCart(article.id);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <label htmlFor={`quantity-${article.id}`} className="text-sm font-medium text-gray-700">
          Quantité:
        </label>
        <input
          id={`quantity-${article.id}`}
          type="number"
          min="1"
          max={article.stock}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 px-2 py-1 border-2 border-gray-400 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50 transition-colors"
          aria-label={`Quantité pour ${article.nom} (max: ${article.stock})`}
          title={`Sélectionnez la quantité pour ${article.nom} (maximum: ${article.stock})`}
        />
      </div>

      {isInCartCurrently && (
        <div className="text-sm text-blue-600 font-medium">
          Déjà {currentQuantity} dans le panier
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={article.stock === 0}
        className="w-full"
        variant={article.stock === 0 ? 'disabled' : 'primary'}
      >
        {article.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
      </Button>
    </div>
  );
}

export default function ArticleCard({ article, viewMode }: ArticleCardProps) {
  if (viewMode === 'grid') {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <ArticleImage article={article} />
        
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {article.nom}
          </h3>
          
          <ArticleBadges article={article} />
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {article.descriptionCourte}
          </p>

          <ArticlePrice price={article.prix} />
          
          <div className="space-y-3 mt-auto">
            <AddToCartButton article={article} />
            
            <Link
              href={`/marketplace/${article.id}`}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Voir les détails
            </Link>
          </div>
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
              <Badge variant="default">{article.type}</Badge>
              <Badge variant={article.stock > 10 ? 'success' : article.stock > 0 ? 'warning' : 'danger'}>
                Stock: {article.stock}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(article.prix)}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <AddToCartButton article={article} />
            </div>
            
            <Link
              href={`/marketplace/${article.id}`}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Voir les détails
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 