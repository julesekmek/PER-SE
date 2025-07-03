import React from 'react';

type SortOption = 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc';
type ViewMode = 'grid' | 'list';

interface CatalogueControlsProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  availableTypes: string[];
  filteredCount: number;
}

export default function CatalogueControls({
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  availableTypes,
  filteredCount
}: CatalogueControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Filtres par type */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <label htmlFor="type-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Filtrer par type :
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            aria-describedby="type-filter-description"
          >
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'Tous les types' : type}
              </option>
            ))}
          </select>
          <div id="type-filter-description" className="sr-only">
            Sélectionnez un type d'armement pour filtrer les résultats
          </div>
        </div>

        {/* Tri */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Trier par :
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            aria-describedby="sort-select-description"
          >
            <option value="name-asc">Nom (A → Z)</option>
            <option value="name-desc">Nom (Z → A)</option>
            <option value="stock-asc">Stock croissant</option>
            <option value="stock-desc">Stock décroissant</option>
          </select>
          <div id="sort-select-description" className="sr-only">
            Sélectionnez un critère de tri pour organiser les articles
          </div>
        </div>

        {/* Basculement de vue */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Vue :</span>
          <div className="flex bg-gray-100 rounded-lg p-1" role="group" aria-label="Sélection de la vue">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Vue grille"
              aria-pressed={viewMode === 'grid'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Vue liste"
              aria-pressed={viewMode === 'list'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {filteredCount} article{filteredCount !== 1 ? 's' : ''} trouvé{filteredCount !== 1 ? 's' : ''}
          {selectedType !== 'all' && ` dans la catégorie "${selectedType}"`}
        </p>
      </div>
    </div>
  );
} 