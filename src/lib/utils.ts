import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine les classes CSS de manière conditionnelle avec clsx et twMerge
 * Permet de fusionner les classes Tailwind de manière optimale
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix en euros avec 2 décimales
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Détermine la couleur du badge de stock selon la quantité
 */
export function getStockColor(stock: number): string {
  if (stock > 10) return 'bg-green-100 text-green-800';
  if (stock > 0) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un mot de passe (minimum 6 caractères)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Génère un ID unique
 */
export function generateId<T extends { id: number }>(items: T[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
} 