'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { isValidEmail, isValidPassword } from '@/lib/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Validation des entrées
    if (!email || !password) {
      return { success: false, error: 'Email et mot de passe requis' };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: 'Format d\'email invalide' };
    }

    if (!isValidPassword(password)) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Erreur de connexion' };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = async (nom: string, email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'Utilisateur non connecté' };
    }

    // Validation des entrées
    if (!nom.trim()) {
      return { success: false, message: 'Le nom est requis' };
    }

    if (!isValidEmail(email)) {
      return { success: false, message: 'Format d\'email invalide' };
    }

    if (password && !isValidPassword(password)) {
      return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
    }

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nom: nom.trim(), 
          email: email.trim(), 
          password,
          userId: user.id 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Mettre à jour l'utilisateur dans le contexte et le localStorage
        const updatedUser = { ...user, nom: data.user.nom, email: data.user.email };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, message: data.message || 'Profil mis à jour avec succès' };
      } else {
        return { success: false, message: data.error || 'Erreur lors de la mise à jour' };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
} 