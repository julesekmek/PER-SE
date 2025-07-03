'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Armement App
            </Link>
          </div>

          {/* Navigation principale */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/catalogue" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
              >
                Catalogue
              </Link>
              
              <Link 
                href="/compte" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
              >
                Mon Compte
              </Link>

              {/* Liens admin */}
              {user.role === 'admin' && (
                <>
                  <Link 
                    href="/admin/utilisateurs" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
                  >
                    Gestion Utilisateurs
                  </Link>
                  <Link 
                    href="/admin/catalogue" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
                  >
                    Gestion Catalogue
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Informations utilisateur et déconnexion */}
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {user.nom} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/catalogue" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
            >
              Catalogue
            </Link>
            
            <Link 
              href="/compte" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
            >
              Mon Compte
            </Link>

            {user.role === 'admin' && (
              <>
                <Link 
                  href="/admin/utilisateurs" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
                >
                  Gestion Utilisateurs
                </Link>
                <Link 
                  href="/admin/catalogue" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors"
                >
                  Gestion Catalogue
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 