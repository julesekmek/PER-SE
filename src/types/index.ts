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
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
} 