import React from 'react';
import { Filter, CalendarDays, MapPin, CreditCard, TrendingUp } from 'lucide-react';
import { SortOption, FilterOption } from '../../types';

interface FilterPanelProps {
  sortOption: SortOption;
  filterOption: FilterOption;
  onSortChange: (option: SortOption) => void;
  onFilterChange: (option: FilterOption) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  sortOption, 
  filterOption, 
  onSortChange, 
  onFilterChange 
}) => {
  const genres: string[] = ['Rock', 'Pop', 'Electronic', 'Hip-hop', 'Jazz', 'Folk', 'Metal', 'Indie'];

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold">Sort By</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => onSortChange('popularity')}
            className={`btn ${sortOption === 'popularity' ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-2`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Popularity
          </button>
          <button
            onClick={() => onSortChange('date')}
            className={`btn ${sortOption === 'date' ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-2`}
          >
            <CalendarDays className="w-4 h-4 mr-1" />
            Date
          </button>
          <button
            onClick={() => onSortChange('price')}
            className={`btn ${sortOption === 'price' ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-2`}
          >
            <CreditCard className="w-4 h-4 mr-1" />
            Price
          </button>
          <button
            onClick={() => onSortChange('location')}
            className={`btn ${sortOption === 'location' ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-2`}
          >
            <MapPin className="w-4 h-4 mr-1" />
            Location
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold">Filter by Genre</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`btn ${filterOption === 'all' ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-2`}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onFilterChange(genre.toLowerCase())}
              className={`btn ${filterOption === genre.toLowerCase() ? 'btn-primary' : 'btn-outline'} text-sm py-1 px-2`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;