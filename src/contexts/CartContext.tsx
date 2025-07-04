'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { CartItem, Article } from '@/types';

interface CartState {
  items: CartItem[];
  totalItems: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { articleId: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { articleId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { articleId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  addToCart: (articleId: number, quantity: number) => void;
  removeFromCart: (articleId: number) => void;
  updateQuantity: (articleId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (articleId: number) => number;
  isInCart: (articleId: number) => boolean;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.articleId === action.payload.articleId);
      
      if (existingItem) {
        // Si l'article existe déjà, on met à jour la quantité
        const updatedItems = state.items.map(item =>
          item.articleId === action.payload.articleId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      } else {
        // Sinon on ajoute un nouvel article
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.articleId !== action.payload.articleId);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.articleId === action.payload.articleId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0
      };
    
    case 'LOAD_CART':
      return {
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0)
      };
    
    default:
      return state;
  }
};

const CART_STORAGE_KEY = 'armement-cart';

// Fonction utilitaire pour vérifier si localStorage est disponible
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Fonction utilitaire pour sauvegarder dans localStorage
const saveToLocalStorage = (key: string, data: any): void => {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }
};

// Fonction utilitaire pour charger depuis localStorage
const loadFromLocalStorage = (key: string): any => {
  if (isLocalStorageAvailable()) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erreur lors du chargement depuis localStorage:', error);
      return null;
    }
  }
  return null;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = loadFromLocalStorage(CART_STORAGE_KEY);
    if (savedCart && Array.isArray(savedCart)) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(CART_STORAGE_KEY, state.items);
    }
  }, [state.items, isLoaded]);

  const addToCart = (articleId: number, quantity: number) => {
    if (quantity <= 0) return;
    dispatch({ type: 'ADD_ITEM', payload: { articleId, quantity } });
  };

  const removeFromCart = (articleId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { articleId } });
  };

  const updateQuantity = (articleId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(articleId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { articleId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (articleId: number): number => {
    const item = state.items.find(item => item.articleId === articleId);
    return item ? item.quantity : 0;
  };

  const isInCart = (articleId: number): boolean => {
    return state.items.some(item => item.articleId === articleId);
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    isLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 