import React from 'react';

interface EmptyStateProps {
  selectedType: string;
  onResetFilter: () => void;
}

export default function EmptyState({ selectedType, onResetFilter }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucun article trouvé
      </h3>
      <p className="text-gray-600 mb-4">
        {selectedType !== 'all' 
          ? `Aucun article de type "${selectedType}" n'est disponible.`
          : 'Le catalogue est vide pour le moment.'
        }
      </p>
      {selectedType !== 'all' && (
        <button
          onClick={onResetFilter}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-900 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Voir tous les articles
        </button>
      )}
    </div>
  );
} 