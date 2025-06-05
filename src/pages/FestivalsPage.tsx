import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFestival } from '../context/FestivalContext';
import FestivalCard from '../components/common/FestivalCard';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import { SortOption, FilterOption, LocationFilter } from '../types';

const FestivalsPage: React.FC = () => {
  const { 
    filteredFestivals, 
    setSearchTerm, 
    setSortOption, 
    setFilterOption,
    setLocationFilter,
    sortOption,
    filterOption,
    locationFilter
  } = useFestival();
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    const searchTerm = searchParams.get('search') || '';
    const sort = searchParams.get('sort') as SortOption || 'popularity';
    const filter = searchParams.get('filter') as FilterOption || 'all';
    const location = searchParams.get('location') as LocationFilter || 'all';
    
    setSearchTerm(searchTerm);
    setSortOption(sort);
    setFilterOption(filter);
    setLocationFilter(location);
  }, [searchParams, setSearchTerm, setSortOption, setFilterOption, setLocationFilter]);
  
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
    updateSearchParams('filter', option);
  };

  const handleLocationChange = (location: LocationFilter) => {
    setLocationFilter(location);
    updateSearchParams('location', location.toLowerCase());
  };
  
  const updateSearchParams = (param: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(param, value);
    } else {
      newParams.delete(param);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="relative h-[300px] rounded-xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-festival-texture bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/70"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
            <h1 className="text-white mb-4 max-w-2xl">Utforsk festivaler</h1>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Utforsk de mest spennende festivalene som foregår i Norge. Filtrér, sorter og finn din neste opplevelse.
            </p>
            <div className="max-w-xl">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Søk etter festivalnavn, lokasjon eller genre..."
                className="shadow-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-56">
              <FilterPanel 
                sortOption={sortOption}
                filterOption={filterOption}
                locationFilter={locationFilter}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>
          
          {/* Festivals Grid */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <p className="text-gray-600">
                Fant <span className="font-semibold text-primary-500">{filteredFestivals.length}</span> festivaler
                {filterOption !== 'all' && (
                  <span> i kategorien <span className="font-semibold text-primary-500">{filterOption}</span></span>
                )}
              </p>
            </div>
            
            {/* Festival Cards */}
            {filteredFestivals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFestivals.map(festival => (
                  <FestivalCard key={festival.id} festival={festival} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Ingen festivaler funnet</h3>
                <p className="text-gray-500 mb-6">Prøv å justere søket eller filterne dine.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSortOption('popularity');
                    setFilterOption('all');
                    setSearchParams(new URLSearchParams());
                  }}
                  className="btn btn-primary"
                >
                  Tilbakestill filtre
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalsPage;