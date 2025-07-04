'use client';

import { useState, useRef, useEffect } from 'react';
import { OrderStatus } from '@/types';
import Badge from './Badge';

interface StatusDropdownProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  isUpdating?: boolean;
  disabled?: boolean;
}

// Composant pour afficher le badge de statut
function StatusBadge({ status }: { status: OrderStatus }) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'En attente de validation':
        return { color: 'warning', text: 'En attente' };
      case 'En cours':
        return { color: 'primary', text: 'En cours' };
      case 'Expédié':
        return { color: 'info', text: 'Expédié' };
      case 'Reçu':
        return { color: 'success', text: 'Reçu' };
      default:
        return { color: 'default', text: status };
    }
  };

  const config = getStatusConfig(status);
  return <Badge variant={config.color as any}>{config.text}</Badge>;
}

export default function StatusDropdown({ 
  currentStatus, 
  onStatusChange, 
  isUpdating = false,
  disabled = false 
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions: OrderStatus[] = [
    'En attente de validation',
    'En cours',
    'Expédié',
    'Reçu'
  ];

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fermer le menu avec la touche Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleStatusSelect = (status: OrderStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && !isUpdating && setIsOpen(!isOpen)}
        disabled={disabled || isUpdating}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Changer le statut de la commande"
      >
        <StatusBadge status={currentStatus} />
        {!isUpdating && (
          <svg
            className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
        {isUpdating && (
          <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-200">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
            Changer le statut
          </div>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status)}
              className={`block w-full text-left px-4 py-3 text-sm transition-colors focus:outline-none ${
                status === currentStatus
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              role="menuitem"
              aria-selected={status === currentStatus}
            >
              <div className="flex items-center justify-between">
                <span>{status}</span>
                {status === currentStatus && (
                  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 