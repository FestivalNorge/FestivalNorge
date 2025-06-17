import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFestival } from '../context/FestivalContext';
import { Loader2 } from 'lucide-react';
import FestivalCard from '../components/common/FestivalCard';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import { SortOption, FilterOption, LocationFilter, Festival } from '../types';
import { useTranslation, Trans } from 'react-i18next';

const FestivalsPage: React.FC = () => {
  const { 
    filteredFestivals, 
    setSearchTerm, 
    setSortOption, 
    setFilterOption,
    setLocationFilter,
    sortOption,
    filterOption,
    locationFilter,
    userLocation,
    locationError,
    getUserLocation,
    loading,
    error
  } = useFestival();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearchTerm = searchParams.get('search') || '';
  const { t } = useTranslation();
  
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

  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [page, setPage] = useState(0);
  const [displayedFestivals, setDisplayedFestivals] = useState<Festival[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 9; // 3x3 grid items per load



  
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

  // Reset pagination when filters, search, or filteredFestivals change
  useEffect(() => {
    setPage(0);
    setDisplayedFestivals([]);
    setHasMore(true);
    setInitialLoadComplete(false);
  }, [filteredFestivals, selectedFestival]);

  // Load more festivals when reaching the bottom
  const loadMoreFestivals = useCallback(() => {
    if (selectedFestival || !hasMore || loading || isLoadingMore || filteredFestivals.length === 0) {
      return;
    }
    
    setIsLoadingMore(true);
    
    // Calculate the next page items
    const nextPage = page + 1;
    const startIdx = 0; // Always start from the beginning
    const endIdx = Math.min(filteredFestivals.length, (nextPage + 1) * ITEMS_PER_PAGE);
    const nextFestivals = filteredFestivals.slice(startIdx, endIdx);
    
    setDisplayedFestivals(nextFestivals);
    setPage(nextPage);
    setHasMore(endIdx < filteredFestivals.length);
    setInitialLoadComplete(true);
    setIsLoadingMore(false);
  }, [page, hasMore, filteredFestivals, selectedFestival, loading, isLoadingMore, ITEMS_PER_PAGE]);
  
  // Initial load
  useEffect(() => {
    if (!loading && filteredFestivals.length > 0 && !initialLoadComplete) {
      loadMoreFestivals();
    }
  }, [loading, filteredFestivals, initialLoadComplete, loadMoreFestivals]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const currentObserver = loadingRef.current;
    
    if (!currentObserver || !initialLoadComplete) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '100px', // Start loading a bit before reaching the bottom
      threshold: 0.1
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading && !isLoadingMore) {
        loadMoreFestivals();
      }
    };
    
    const observerInstance = new IntersectionObserver(handleIntersect, observerOptions);
    observerInstance.observe(currentObserver);
    
    return () => {
      if (observerInstance) {
        observerInstance.disconnect();
      }
    };
  }, [loadMoreFestivals, hasMore, loading, isLoadingMore, initialLoadComplete]);

  // Handle search with debounce
  const handleSearch = useCallback((term: string) => {
    if (term === '') {
      setSelectedFestival(null);
    } else {
      setPage(1);
    }
    setSearchTerm(term);
    updateSearchParams('search', term);
  }, [setSearchTerm]);

  // Handle suggestion select
  const handleSuggestionSelect = useCallback((festival: Festival) => {
    setSelectedFestival(festival);
    setPage(1);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 max-w-2xl w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-700">{t("error.failed_to_load_festivals")}</h3>
              <div className="mt-2 text-sm text-red-600">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-error"
                >
                  {t("error.try_again")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="relative h-[300px] rounded-xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-festival-texture bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/70"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
            <h1 className="text-white mb-4 max-w-2xl">{t("all_festivals.title")}</h1>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              {t("all_festivals.description")}
            </p>
            <div className="mb-8">
              <SearchBar 
                value={currentSearchTerm}
                onSearch={handleSearch}
                onSuggestionSelect={handleSuggestionSelect}
                placeholder={t("search.placeholder")}
                disableSuggestions={true}
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
                userLocation={userLocation}
                locationError={locationError}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onLocationChange={handleLocationChange}
                onRetryLocation={getUserLocation}
              />
            </div>
          </div>
          
          {/* Festivals Grid */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <p className="text-gray-600">
                <Trans i18nKey={filterOption === 'all'
                      ? 'all_festivals.search_result'
                      : 'all_festivals.search_result_with_filter'
                  }
                  count={filteredFestivals.length}
                  components={[<strong key="c" />]}
                  values={{count: filteredFestivals.length, filter:filterOption === 'all' ? undefined
                        : t(`genres.${filterOption}`, { defaultValue: filterOption })
                  }}
                />
              </p>
            </div>
            
            {/* Festival Cards */}
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
                  <p className="text-gray-600">{t("common.loading")}</p>
                </div>
              </div>
            ) : displayedFestivals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedFestivals.map((festival) => (
                  <FestivalCard key={festival.id} festival={festival} />
                ))}
                {!selectedFestival && hasMore && (
                  <div ref={loadingRef} className="col-span-full flex flex-col items-center py-8 space-y-2">
                    <Loader2 className={`h-8 w-8 text-primary-500 animate-spin ${isLoadingMore ? 'opacity-100' : 'opacity-50'}`} />
                    <span className="text-sm text-gray-500">{t("common.loading_more_festivals")}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg mb-4">{t("common.no_search_results")}</p>
                <button
                  onClick={() => {
                    setSelectedFestival(null);
                    setSearchTerm('');
                    setSortOption('popularity');
                    setFilterOption('all');
                    setLocationFilter('all');
                    setSearchParams(new URLSearchParams());
                  }}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {t("common.reset_filters")}
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