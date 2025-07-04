export interface User {
  id: number;
  email: string;
  password: string;
  nom: string;
  role: 'admin' | 'user';
}

export interface Article {
  id: number;
  nom: string;
  type: string;
  descriptionCourte: string;
  descriptionLongue: string;
  image: string;
  stock: number;
  prix: number;
}

export interface CartItem {
  articleId: number;
  quantity: number;
}

export type OrderStatus = 'En attente de validation' | 'En cours' | 'Expédié' | 'Reçu';

export interface Order {
  id: string;
  userId: number;
  date: string;
  articles: Array<{
    articleId: number;
    nom: string;
    quantity: number;
    stock: number;
    prix: number;
  }>;
  statut: OrderStatus;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (nom: string, email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
} 