import React from 'react';
import { Filter, CalendarDays, MapPin, CreditCard, TrendingUp } from 'lucide-react';
import { SortOption, FilterOption, LocationFilter } from '../../types';

interface FilterPanelProps {
  sortOption: SortOption;
  filterOption: FilterOption;
  locationFilter: LocationFilter;
  userLocation: { lat: number; lng: number } | null;
  locationError: string | null;
  onSortChange: (option: SortOption) => void;
  onFilterChange: (option: FilterOption) => void;
  onLocationChange: (location: LocationFilter) => void;
  onRetryLocation: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  sortOption, 
  filterOption,
  locationFilter,
  userLocation,
  locationError,
  onSortChange, 
  onFilterChange,
  onLocationChange,
  onRetryLocation
}) => {
  const genres: string[] = ['Rock', 'Pop', 'Elektronisk', 'Hip-hop', 'Jazz', 'Folkemusikk', 'Metal', 'Indie'];
  const cities: string[] = ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Kristiansand', 'Tromsø', 'Bodø', 'Molde', 'Kristiansund', 'Ålesund', 'Lillehammer'];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Sort Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-primary-50 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Sorter etter</h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onSortChange('popularity')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
              sortOption === 'popularity'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <TrendingUp className={`w-4 h-4 mr-3 ${
                sortOption === 'popularity' ? 'text-primary-500' : 'text-gray-400'
              }`} />
              Popularitet
            </div>
          </button>
          <button
            onClick={() => onSortChange('date')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
              sortOption === 'date'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <CalendarDays className={`w-4 h-4 mr-3 ${
                sortOption === 'date' ? 'text-primary-500' : 'text-gray-400'
              }`} />
              Dato
            </div>
          </button>
          <button
            onClick={() => onSortChange('price')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
              sortOption === 'price'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <CreditCard className={`w-4 h-4 mr-3 ${
                sortOption === 'price' ? 'text-primary-500' : 'text-gray-400'
              }`} />
              Pris
            </div>
          </button>
          <div className="relative">
            <button
              onClick={() => onSortChange('location')}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                sortOption === 'location'
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'hover:bg-gray-50 text-gray-700'
              } ${
                sortOption === 'location' && locationError ? 'pr-10' : ''
              }`}
              disabled={sortOption === 'location' && userLocation === null && !locationError}
            >
              <div className="flex items-center">
                {sortOption === 'location' && userLocation === null && !locationError ? (
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <MapPin className={`w-4 h-4 mr-3 ${
                    sortOption === 'location' ? 'text-primary-500' : 'text-gray-400'
                  }`} />
                )}
                {sortOption === 'location' && userLocation === null && !locationError 
                  ? 'Finner din posisjon...' 
                  : locationError 
                    ? 'Nærmest meg'
                    : 'Nærmest meg'}
              </div>
            </button>
            
            {sortOption === 'location' && locationError && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRetryLocation();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Prøv igjen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 16h5v5"></path>
                </svg>
              </button>
            )}
            
            {sortOption === 'location' && locationError && (
              <div className="absolute left-0 right-0 mt-1 text-xs text-red-500 px-4">
                {locationError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* By Filter Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-secondary-50 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-secondary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filtrer etter by</h3>
        </div>
        <div className="space-y-2">
          <select
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value as LocationFilter)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Alle byer</option>
            {cities.map((city) => (
              <option key={city} value={city.toLowerCase()}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Genre Filter Section */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-accent-50 p-2 rounded-lg">
            <Filter className="w-5 h-5 text-accent-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filtrer etter sjanger</h3>
        </div>
        <div className="space-y-2">
          <select
            value={filterOption}
            onChange={(e) => onFilterChange(e.target.value as FilterOption)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Alle sjangere</option>
            {genres.map((genre) => (
              <option key={genre} value={genre.toLowerCase()}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;