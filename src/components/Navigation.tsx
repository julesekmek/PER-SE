'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log('=== DÉBUT DÉCONNEXION ===');
    console.log('handleLogout called');
    console.log('Current user:', user);
    console.log('Current isAuthenticated:', isAuthenticated);
    
    try {
      console.log('Calling logout function...');
      logout();
      console.log('Logout function completed');
      
      console.log('Pushing to /login...');
      router.push('/login');
      console.log('Router push completed');
      
      console.log('Closing menus...');
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      console.log('Menus closed');
      
      console.log('=== FIN DÉCONNEXION ===');
    } catch (error) {
      console.error('Error in handleLogout:', error);
    }
  };

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked, current state:', isUserMenuOpen);
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogoutClick = () => {
    console.log('Logout button clicked!');
    handleLogout();
  };

  const handleCompteClick = () => {
    console.log('Compte button clicked!');
    setIsUserMenuOpen(false);
  };

  // Fermer le menu mobile quand on redimensionne l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <nav className="bg-blue-900 text-white shadow-lg relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold tracking-wide hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              PER SE SYSTEMS
            </Link>
          </div>

          {/* Navigation principale - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/catalogue" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Marketplace
              </Link>

              {/* Liens admin */}
              {user.role === 'admin' && (
                <>
                  <Link 
                    href="/admin/utilisateurs" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Gestion Utilisateurs
                  </Link>
                  <Link 
                    href="/admin/catalogue" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Gestion Catalogue
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menu utilisateur - Desktop */}
          <div className="hidden md:block relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                {user.nom.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block">{user.nom}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[9999] border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <div className="font-medium">{user.nom}</div>
                  <div className="text-gray-500 capitalize">{user.role}</div>
                </div>
                
                <Link
                  href="/compte"
                  onClick={handleCompteClick}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                >
                  → Mon compte
                </Link>
                
                <button
                  onClick={handleLogoutClick}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50"
                >
                  → Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Menu utilisateur mobile */}
            <div className="relative">
              <button
                onClick={handleMenuToggle}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.nom.charAt(0).toUpperCase()}
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[9999] border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user.nom}</div>
                    <div className="text-gray-500 capitalize">{user.role}</div>
                  </div>
                  
                  <Link
                    href="/compte"
                    onClick={handleCompteClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                  >
                    → Mon compte
                  </Link>
                  
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50"
                  >
                    → Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Bouton menu burger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu principal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/catalogue" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:bg-blue-800"
              >
                Marketplace
              </Link>

              {user.role === 'admin' && (
                <>
                  <Link 
                    href="/admin/utilisateurs" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:bg-blue-800"
                  >
                    Gestion Utilisateurs
                  </Link>
                  <Link 
                    href="/admin/catalogue" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:bg-blue-800"
                  >
                    Gestion Catalogue
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 