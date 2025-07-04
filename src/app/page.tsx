'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    console.log('🏠 Page d\'accueil - État actuel:', {
      isLoading,
      isAuthenticated,
      user: user ? 'présent' : 'absent'
    });

    // Timeout de sécurité pour éviter le blocage infini
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout atteint - redirection forcée vers /login');
      setTimeoutReached(true);
      router.push('/login');
    }, 5000); // 5 secondes

    if (!isLoading) {
      clearTimeout(timeoutId);
      if (isAuthenticated && user) {
        console.log('🔄 Redirection vers /marketplace (utilisateur authentifié)');
        router.push('/marketplace');
      } else {
        console.log('🔄 Redirection vers /login (utilisateur non authentifié)');
        router.push('/login');
      }
    } else {
      console.log('⏳ En attente de fin de chargement...');
    }

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Redirection en cours...
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          {isLoading ? 'Vérification de l\'authentification...' : 'Préparation de la redirection...'}
        </p>
        {timeoutReached && (
          <p className="mt-2 text-orange-600 text-sm">
            Redirection forcée en cours...
          </p>
        )}
        <div className="mt-4">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
