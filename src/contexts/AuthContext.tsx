'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
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
        return true;
      } else {
        console.error('Erreur de connexion:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
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

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nom, 
          email, 
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
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Erreur lors de la mise à jour' };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    updateProfile,
    isAuthenticated,
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