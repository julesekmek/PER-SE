'use client';

import { useState, useEffect } from 'react';
import { Order, CartItem, Article } from '@/types';

// Fonction utilitaire pour générer un ID unique avec format CMD-YYYY-XXX
const generateOrderId = async (): Promise<string> => {
  try {
    const response = await fetch('/api/orders');
    if (response.ok) {
      const existingOrders = await response.json();
      const currentYear = new Date().getFullYear();
      const yearOrders = existingOrders.filter((order: any) => 
        order.id.startsWith(`CMD-${currentYear}-`)
      );
      const nextNumber = yearOrders.length + 1;
      return `CMD-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
    }
  } catch (error) {
    console.error('Erreur lors de la génération de l\'ID:', error);
  }
  
  // Fallback si erreur
  const currentYear = new Date().getFullYear();
  const timestamp = Date.now();
  return `CMD-${currentYear}-${(timestamp % 1000).toString().padStart(3, '0')}`;
};

// Fonction pour charger les commandes depuis le fichier JSON
const loadOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des commandes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error);
    return [];
  }
};

// Fonction pour sauvegarder les commandes
const saveOrders = async (orders: Order[]): Promise<boolean> => {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orders),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde des commandes');
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des commandes:', error);
    return false;
  }
};

// Fonction pour récupérer une commande par ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const allOrders = await loadOrders();
    return allOrders.find(order => order.id === orderId) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return null;
  }
};

// Fonction pour mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId: string, newStatus: Order['statut']): Promise<boolean> => {
  try {
    const allOrders = await loadOrders();
    const updatedOrders = allOrders.map(order =>
      order.id === orderId ? { ...order, statut: newStatus } : order
    );
    
    return await saveOrders(updatedOrders);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return false;
  }
};

// Hook pour les commandes de l'utilisateur connecté
export function useUserOrders(userId: number) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const allOrders = await loadOrders();
        const userOrders = allOrders.filter(order => order.userId === userId);
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des commandes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return { orders, loading, error };
}

// Hook pour toutes les commandes (admin)
export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const allOrders = await loadOrders();
        setOrders(allOrders);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des commandes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['statut']): Promise<boolean> => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, statut: newStatus } : order
      );
      
      const success = await saveOrders(updatedOrders);
      if (success) {
        setOrders(updatedOrders);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return false;
    }
  };

  return { orders, loading, error, updateOrderStatus };
}

// Hook pour créer une nouvelle commande
export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (
    userId: number,
    cartItems: CartItem[],
    articles: Article[]
  ): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier le stock disponible
      const stockErrors: string[] = [];
      const orderArticles = cartItems.map(item => {
        const article = articles.find(a => a.id === item.articleId);
        if (!article) {
          throw new Error(`Article ${item.articleId} non trouvé`);
        }
        
        if (item.quantity > article.stock) {
          stockErrors.push(`${article.nom}: quantité demandée (${item.quantity}) > stock disponible (${article.stock})`);
        }
        
        return {
          articleId: item.articleId,
          nom: article.nom,
          quantity: item.quantity,
          stock: article.stock,
          prix: article.prix
        };
      });

      if (stockErrors.length > 0) {
        throw new Error(`Stock insuffisant pour: ${stockErrors.join(', ')}`);
      }

      // Créer la nouvelle commande
      const newOrder: Order = {
        id: await generateOrderId(),
        userId,
        date: new Date().toISOString(),
        articles: orderArticles,
        statut: 'En attente de validation'
      };

      // Charger les commandes existantes et ajouter la nouvelle
      const existingOrders = await loadOrders();
      const updatedOrders = [...existingOrders, newOrder];
      
      const success = await saveOrders(updatedOrders);
      if (!success) {
        throw new Error('Erreur lors de la sauvegarde de la commande');
      }

      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la commande';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
} 