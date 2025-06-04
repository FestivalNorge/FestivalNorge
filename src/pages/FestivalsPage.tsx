import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFestival } from '../context/FestivalContext';
import FestivalCard from '../components/common/FestivalCard';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import { SortOption, FilterOption } from '../types';

const FestivalsPage: React.FC = () => {
  const { 
    filteredFestivals, 
    setSearchTerm, 
    setSortOption, 
    setFilterOption,
    sortOption,
    filterOption
  } = useFestival();
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize from URL params
  useEffect(() => {
    const searchTerm = searchParams.get('search') || '';
    const sort = searchParams.get('sort') as SortOption || 'popularity';
    const genre = searchParams.get('genre') as FilterOption || 'all';
    
    setSearchTerm(searchTerm);
    setSortOption(sort);
    setFilterOption(genre);
  }, []);
  
  // Update search params when filters change
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateSearchParams('search', term);
  };
  
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    updateSearchParams('sort', option);
  };
  
  const handleFilterChange = (option: FilterOption) => {
    setFilterOption(option);
    updateSearchParams('genre', option);
  };
  
  const updateSearchParams = (param: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(param, value);
    } else {
      newParams.delete(param);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="bg-primary-500 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8 md:p-12">
            <h1 className="text-white mb-4">Explore Festivals</h1>
            <p className="text-white/90 text-lg mb-6 max-w-3xl">
              Discover and filter through all the exciting festivals happening across Norway.
            </p>
            <div className="max-w-xl">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search by festival name, location, or genre..."
              />
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="mb-8">
          <FilterPanel 
            sortOption={sortOption}
            filterOption={filterOption}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredFestivals.length}</span> festivals
          </p>
        </div>
        
        {/* Festivals Grid */}
        {filteredFestivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFestivals.map(festival => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No festivals found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalsPage;