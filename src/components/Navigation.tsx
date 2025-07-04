'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface UserMenuProps {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
  onCompteClick: () => void;
  isMobile?: boolean;
}

function UserMenu({ user, isOpen, onToggle, onClose, onLogout, onCompteClick, isMobile = false }: UserMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Ajouter un délai pour permettre aux clics dans le menu de s'exécuter
        setTimeout(() => {
          onClose();
        }, 100);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none min-w-0",
          isMobile ? "hover:bg-blue-800" : "hover:bg-blue-800"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {user.nom.charAt(0).toUpperCase()}
        </div>
        {!isMobile && <span className="hidden sm:block truncate">{user.nom}</span>}
        <svg
          className={cn("w-4 h-4 transition-transform flex-shrink-0", isOpen ? "rotate-180" : "")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
            <div className="font-medium truncate">{user.nom}</div>
            <div className="text-gray-500 capitalize">{user.role}</div>
          </div>
          
          <Link
            href="/compte"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Clic sur Mon compte');
              onCompteClick();
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
          >
            → Mon compte
          </Link>

          {user.role !== 'admin' && (
            <Link
              href="/mes-commandes"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Clic sur Mes commandes');
                onCompteClick();
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
            >
              → Mes commandes
            </Link>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Clic sur Déconnexion');
              onLogout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50"
            type="button"
          >
            → Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
}

function NavigationLink({ href, children, onClick, isMobile = false }: NavigationLinkProps) {
  const baseClasses = "rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900";
  const mobileClasses = "block px-3 py-2 text-base text-white hover:bg-blue-800 hover:text-blue-100 focus:bg-blue-800 focus:text-blue-100";
  const desktopClasses = "px-3 py-2 text-white hover:bg-blue-800 hover:text-blue-100 focus:bg-blue-800 focus:text-blue-100";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Clic sur', children);
      onClick();
    }
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className={cn(baseClasses, isMobile ? mobileClasses : desktopClasses)}
    >
      {children}
    </Link>
  );
}

function CartLink() {
  const { state, isLoaded } = useCart();
  
  return (
    <Link
      href="/panier"
      className="relative px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-800 hover:text-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900 focus:bg-blue-800 focus:text-blue-100"
      aria-label="Panier"
    >
      Panier
      {isLoaded && state.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
          {state.totalItems > 99 ? '99+' : state.totalItems}
        </span>
      )}
    </Link>
  );
}

// Navigation pour utilisateur simple
function UserNavigation({ onMobileMenuClose }: { onMobileMenuClose: () => void }) {
  return (
    <>
      <NavigationLink href="/marketplace">
        Marketplace
      </NavigationLink>
      <CartLink />
      <NavigationLink href="/mes-commandes">
        Commandes
      </NavigationLink>
    </>
  );
}

// Navigation pour administrateur
function AdminNavigation({ onMobileMenuClose }: { onMobileMenuClose: () => void }) {
  return (
    <>
      <NavigationLink href="/admin/utilisateurs">
        Utilisateurs
      </NavigationLink>
      <NavigationLink href="/admin/marketplace">
        Articles
      </NavigationLink>
      <NavigationLink href="/admin/commandes">
        Commandes
      </NavigationLink>
    </>
  );
}

// Navigation mobile pour utilisateur simple
function UserMobileNavigation({ onMobileMenuClose }: { onMobileMenuClose: () => void }) {
  return (
    <>
      <NavigationLink 
        href="/marketplace" 
        onClick={onMobileMenuClose}
        isMobile
      >
        Marketplace
      </NavigationLink>
      <NavigationLink 
        href="/panier" 
        onClick={onMobileMenuClose}
        isMobile
      >
        Panier
      </NavigationLink>
      <NavigationLink 
        href="/mes-commandes" 
        onClick={onMobileMenuClose}
        isMobile
      >
        Commandes
      </NavigationLink>
    </>
  );
}

// Navigation mobile pour administrateur
function AdminMobileNavigation({ onMobileMenuClose }: { onMobileMenuClose: () => void }) {
  return (
    <>
      <NavigationLink 
        href="/admin/utilisateurs" 
        onClick={onMobileMenuClose}
        isMobile
      >
        Utilisateurs
      </NavigationLink>
      <NavigationLink 
        href="/admin/marketplace" 
        onClick={onMobileMenuClose}
        isMobile
      >
        Articles
      </NavigationLink>
      <NavigationLink 
        href="/admin/commandes" 
        onClick={onMobileMenuClose}
        isMobile
      >
        Commandes
      </NavigationLink>
    </>
  );
}

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log('=== DÉCONNEXION DÉBUT ===');
    console.log('Déconnexion en cours...');
    
    try {
      // Vider le panier
      console.log('Vidage du panier...');
      clearCart();
      console.log('Panier vidé');
      
      // Déconnecter l'utilisateur
      console.log('Déconnexion de l\'utilisateur...');
      logout();
      console.log('Utilisateur déconnecté');
      
      // Fermer les menus
      console.log('Fermeture des menus...');
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      console.log('Menus fermés');
      
      // Rediriger immédiatement
      console.log('Redirection vers /login...');
      router.push('/login');
      console.log('Redirection effectuée');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    
    console.log('=== DÉCONNEXION FIN ===');
  };

  const handleMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleUserMenuClose = () => {
    setIsUserMenuOpen(false);
  };

  const handleCompteClick = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Fermer les menus quand on redimensionne l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermer le menu utilisateur quand on change de route
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [router]);

  console.log('🧭 Navigation - État:', {
    isAuthenticated,
    user: user ? 'présent' : 'absent',
    userRole: user?.role
  });

  if (!isAuthenticated || !user) {
    console.log('🚫 Navigation masquée - utilisateur non authentifié');
    return null;
  }

  const isAdmin = user.role === 'admin';
  console.log('✅ Navigation affichée - utilisateur:', user.role);

  return (
    <nav className="bg-blue-900 text-white shadow-lg relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold tracking-wide hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900 rounded"
            >
              PER SE SYSTEMS
            </Link>
          </div>

          {/* Navigation principale - Desktop - Centrée */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6">
              {isAdmin ? (
                <AdminNavigation onMobileMenuClose={handleMobileMenuClose} />
              ) : (
                <UserNavigation onMobileMenuClose={handleMobileMenuClose} />
              )}
            </div>
          </div>

          {/* Menu utilisateur - Desktop */}
          <div className="hidden md:block flex-shrink-0">
            <UserMenu
              user={user}
              isOpen={isUserMenuOpen}
              onToggle={handleMenuToggle}
              onClose={handleUserMenuClose}
              onLogout={handleLogout}
              onCompteClick={handleCompteClick}
            />
          </div>

          {/* Menu utilisateur - Mobile */}
          <div className="md:hidden ml-2">
            <UserMenu
              user={user}
              isOpen={isUserMenuOpen}
              onToggle={handleMenuToggle}
              onClose={handleUserMenuClose}
              onLogout={handleLogout}
              onCompteClick={handleCompteClick}
              isMobile
            />
          </div>

          {/* Bouton menu burger - Mobile uniquement */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMobileMenuToggle();
            }}
            className="md:hidden p-2 rounded-md text-white hover:bg-blue-800 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none"
            aria-expanded={isMobileMenuOpen}
            aria-label="Menu principal"
            type="button"
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

        {/* Navigation mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-800 bg-blue-900">
            <div className="px-4 pt-3 pb-4 space-y-2">
              {isAdmin ? (
                <AdminMobileNavigation onMobileMenuClose={handleMobileMenuClose} />
              ) : (
                <UserMobileNavigation onMobileMenuClose={handleMobileMenuClose} />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 