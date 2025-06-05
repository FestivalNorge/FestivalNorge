import React from 'react';
import { Filter, CalendarDays, MapPin, CreditCard, TrendingUp } from 'lucide-react';
import { SortOption, FilterOption, LocationFilter } from '../../types';

interface FilterPanelProps {
  sortOption: SortOption;
  filterOption: FilterOption;
  locationFilter: LocationFilter;
  onSortChange: (option: SortOption) => void;
  onFilterChange: (option: FilterOption) => void;
  onLocationChange: (location: LocationFilter) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  sortOption, 
  filterOption,
  locationFilter,
  onSortChange, 
  onFilterChange,
  onLocationChange
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
          <button
            onClick={() => onSortChange('location')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
              sortOption === 'location'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <MapPin className={`w-4 h-4 mr-3 ${
                sortOption === 'location' ? 'text-primary-500' : 'text-gray-400'
              }`} />
              Sted
            </div>
          </button>
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