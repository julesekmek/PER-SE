'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Vérifier le localStorage
    try {
      const userData = localStorage.getItem('user');
      const cartData = localStorage.getItem('armement-cart');
      
      setLocalStorageData({
        user: userData ? JSON.parse(userData) : null,
        cart: cartData ? JSON.parse(cartData) : null,
        userRaw: userData,
        cartRaw: cartData
      });
    } catch (error) {
      setErrors(prev => [...prev, `Erreur localStorage: ${error}`]);
    }
  }, []);

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('armement-cart');
      setLocalStorageData({
        user: null,
        cart: null,
        userRaw: null,
        cartRaw: null
      });
      setErrors(prev => [...prev, 'localStorage vidé']);
    } catch (error) {
      setErrors(prev => [...prev, `Erreur vidage: ${error}`]);
    }
  };

  const setTestUser = () => {
    try {
      const testUser = {
        id: "test-123",
        nom: "Test User",
        email: "test@example.com",
        role: "user"
      };
      localStorage.setItem('user', JSON.stringify(testUser));
      setLocalStorageData(prev => ({
        ...prev,
        user: testUser,
        userRaw: JSON.stringify(testUser)
      }));
      setErrors(prev => [...prev, 'Utilisateur test défini']);
    } catch (error) {
      setErrors(prev => [...prev, `Erreur test user: ${error}`]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Page de Diagnostic</h1>
        
        {/* État de l'authentification */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">État de l'authentification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-medium">isLoading</div>
              <div className="text-2xl">{isLoading ? '✅' : '❌'}</div>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <div className="font-medium">isAuthenticated</div>
              <div className="text-2xl">{isAuthenticated ? '✅' : '❌'}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-medium">User présent</div>
              <div className="text-2xl">{user ? '✅' : '❌'}</div>
            </div>
          </div>
          
          {user && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Données utilisateur :</h3>
              <pre className="text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* localStorage */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">localStorage</h2>
          <div className="mb-4">
            <button
              onClick={clearLocalStorage}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-2"
            >
              Vider localStorage
            </button>
            <button
              onClick={setTestUser}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Définir utilisateur test
            </button>
          </div>
          
          {localStorageData && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Utilisateur :</h3>
                <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">
                  {localStorageData.userRaw || 'null'}
                </pre>
              </div>
              <div>
                <h3 className="font-medium mb-2">Panier :</h3>
                <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">
                  {localStorageData.cartRaw || 'null'}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Erreurs */}
        {errors.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Erreurs</h2>
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="p-2 bg-red-50 text-red-700 rounded">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <a
              href="/"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Retour à l'accueil
            </a>
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Page de connexion
            </a>
            <a
              href="/marketplace"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Marketplace
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 