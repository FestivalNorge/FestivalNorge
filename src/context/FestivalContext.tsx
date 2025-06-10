import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { Festival, SortOption, FilterOption, LocationFilter } from '../types';
import { getFestivals } from '../services/festivalService';

interface FestivalContextType {
  festivals: Festival[];
  popularFestivals: Festival[];
  filteredFestivals: Festival[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortOption: SortOption;
  filterOption: FilterOption;
  locationFilter: LocationFilter;
  userLocation: { lat: number; lng: number } | null;
  locationError: string | null;
  setSearchTerm: (term: string) => void;
  setSortOption: (option: SortOption) => void;
  setFilterOption: (option: FilterOption) => void;
  setLocationFilter: (location: LocationFilter) => void;
  getFestivalById: (id: string) => Festival | undefined;
  getUpcomingFestivals: () => Festival[];
  getFestivalsByMonth: (month: number, year: number) => Festival[];
  getUserLocation: () => void;
}

const FestivalContext = createContext<FestivalContextType | undefined>(undefined);

export const FestivalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [filteredFestivals, setFilteredFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const locationRequested = useRef(false);

  // Fetch festivals from Firebase
  const fetchFestivals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFestivals();
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid festival data received');
      }
      
      // Validate each festival before setting state
      const validFestivals = data.filter((festival: any) => {
        return festival && 
               festival.id && 
               festival.name && 
               festival.location && 
               festival.dates && 
               festival.price;
      });

      // Transform festivals to ensure consistent data format
      const transformedFestivals = validFestivals.map(festival => {
        // Create a copy of location without venue (if it exists)
        const locationData = festival.location || {};
        const { venue, ...locationWithoutVenue } = locationData as any;
        
        return {
          ...festival,
          // Use venue from root if it exists, otherwise from location (for backward compatibility)
          venue: festival.venue || venue,
          location: {
            ...locationWithoutVenue,
            coordinates: festival.location.coordinates || {
              latitude: 0,
              longitude: 0
            }
          }
        };
      });

      setFestivals(transformedFestivals);
      setFilteredFestivals(transformedFestivals);
      setError(null);
    } catch (err) {
      console.error('Error fetching festivals:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setFestivals([]);
      setFilteredFestivals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (locationRequested.current) return;
    
    locationRequested.current = true;
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Don't set a default location - just keep it null
          // This will make the button show the error state
          locationRequested.current = false; // Allow retry
          setLocationError('Kunne ikke hente posisjon. Prøv igjen.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      // Don't set a default location - just keep it null
      locationRequested.current = false; // Allow retry
      setLocationError('Nettleseren din støtter ikke posisjonering.');
    }
  }, []);

  // Calculate distance between two points in kilometers using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Initial data fetch
  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);
  
  // Get user's location when sort option changes to 'location'
  useEffect(() => {
    if (sortOption === 'location' && !userLocation && !locationError) {
      getUserLocation();
    }
  }, [sortOption, userLocation, getUserLocation, locationError]);
  
  // Reset location request when sort option changes from 'location'
  useEffect(() => {
    if (sortOption !== 'location') {
      locationRequested.current = false;
    }
  }, [sortOption]);

  // Apply filters and sort whenever the dependencies change
  useEffect(() => {
    if (loading) return;
    
    let result = [...festivals];
    
    // If there was an error, don't filter/sort
    if (error) {
      setFilteredFestivals([]);
      return;
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(festival => 
        festival.name.toLowerCase().includes(term) || 
        festival.location.city.toLowerCase().includes(term) ||
        festival.genres.some(genre => genre.toLowerCase().includes(term))
      );
    }
    
    // Apply genre filter
    if (filterOption !== 'all') {
      result = result.filter(festival => 
        festival.genres.some(genre => 
          genre.toLowerCase() === filterOption.toLowerCase()
        )
      );
    }
    
    // Apply location filter
    if (locationFilter !== 'all') {
      result = result.filter(festival => 
        festival.location.city.toLowerCase() === locationFilter.toLowerCase()
      );
    }
    
    // Apply sorting
    result = sortFestivals(result, sortOption);
    
    setFilteredFestivals(result);
  }, [festivals, searchTerm, sortOption, filterOption, locationFilter]);

  // Sort festivals based on the selected option
  const sortFestivals = (festivalList: Festival[], option: SortOption): Festival[] => {
    const sortedList = [...festivalList];
    
    switch (option) {
      case 'popularity':
        return sortedList.sort((a, b) => b.popularity - a.popularity);
      case 'date':
        return sortedList.sort((a, b) => 
          new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime()
        );
      case 'price':
        return sortedList.sort((a, b) => a.price.fullPass - b.price.fullPass);
      case 'location':
        if (userLocation) {
          return sortedList.sort((a, b) => {
            const aDistance = calculateDistance(
              userLocation.lat, 
              userLocation.lng, 
              a.location.coordinates.latitude, 
              a.location.coordinates.longitude
            );
            const bDistance = calculateDistance(
              userLocation.lat, 
              userLocation.lng, 
              b.location.coordinates.latitude, 
              b.location.coordinates.longitude
            );
            return aDistance - bDistance;
          });
        }
        // Fallback to alphabetical sort if location is not available
        return sortedList.sort((a, b) => 
          a.location.city.localeCompare(b.location.city)
        );
      default:
        return sortedList;
    }
  };

  // Get festival by ID
  const getFestivalById = (id: string): Festival | undefined => {
    return festivals.find(festival => festival.id === id);
  };

  // Get popular festivals
  const popularFestivals = festivals
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6); // Show top 6 popular festivals

  // Get upcoming festivals (starting from today)
  const getUpcomingFestivals = (): Festival[] => {
    const today = new Date();
    return festivals
      .filter(festival => new Date(festival.dates.start) >= today)
      .sort((a, b) => 
        new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime()
      )
      .slice(0, 5);
  };

  // Get festivals by month and year
  const getFestivalsByMonth = (month: number, year: number): Festival[] => {
    return festivals.filter(festival => {
      const startDate = new Date(festival.dates.start);
      return startDate.getMonth() === month && startDate.getFullYear() === year;
    });
  };

  return (
    <FestivalContext.Provider
      value={{
        festivals,
        popularFestivals,
        filteredFestivals,
        loading,
        error,
        searchTerm,
        sortOption,
        filterOption,
        locationFilter,
        userLocation,
        locationError,
        setSearchTerm,
        setSortOption,
        setFilterOption,
        setLocationFilter,
        getFestivalById,
        getUpcomingFestivals,
        getFestivalsByMonth,
        getUserLocation,
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
};

export const useFestival = () => {
  const context = useContext(FestivalContext);
  if (context === undefined) {
    throw new Error('useFestival must be used within a FestivalProvider');
  }
  return context;
};