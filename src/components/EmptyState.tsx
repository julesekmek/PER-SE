import React from 'react';

interface EmptyStateProps {
  selectedType: string;
  onResetFilter: () => void;
}

export default function EmptyState({ selectedType, onResetFilter }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucun article trouvé
      </h3>
      
      <p className="text-gray-500 mb-6">
        {selectedType === 'all' 
          ? "Aucun article n'est disponible pour le moment."
          : `Aucun article de type "${selectedType}" n'est disponible.`
        }
      </p>
      
      {selectedType !== 'all' && (
        <button
          onClick={onResetFilter}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-blue-900 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Voir tous les articles
        </button>
      )}
    </div>
  );
} 