import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Map, Star, ArrowRight, MapPin, AlertCircle } from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import FestivalCard from '../components/common/FestivalCard';
import SearchBar from '../components/common/SearchBar';
import { Festival } from '../types';

// Define coordinate types
type Coordinates = 
  | { latitude: number; longitude: number }
  | { lat: number | string; lng: number | string }
  | [number | string, number | string];

interface FestivalWithDistance extends Omit<Festival, 'location'> {
  id: string;
  location: Festival['location'] & {
    coordinates: Coordinates;
  };
  distance: number;
}

// Helper function to calculate distance between two coordinates in km
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

const HomePage: React.FC = () => {
  const { popularFestivals, getUpcomingFestivals, festivals } = useFestival();
  const upcomingFestivals = getUpcomingFestivals();
  const [nearbyFestivals, setNearbyFestivals] = useState<FestivalWithDistance[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [hasLocation, setHasLocation] = useState<boolean>(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState<boolean>(true);

  // Check for saved location or geolocation permission on component mount
  useEffect(() => {
    let isMounted = true;
    
    const checkGeolocationPermission = async () => {
      try {
        // First, check if we have a saved location in localStorage
        const savedLocation = localStorage.getItem('userLocation');
        const savedFestivals = localStorage.getItem('nearbyFestivals');
        
        if (savedLocation && savedFestivals) {
          // If we have saved data, use it
          if (isMounted) {
            setHasLocation(true);
            setNearbyFestivals(JSON.parse(savedFestivals));
            setIsCheckingPermission(false);
          }
          return;
        }
        
        // If no saved data, check geolocation permission
        if (navigator.permissions) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
            
            if (permissionStatus.state === 'granted' && isMounted) {
              // If permission is already granted, fetch nearby festivals
              await handleFindNearbyFestivals();
            }
          } catch (permissionError) {
            console.error('Error checking geolocation permission:', permissionError);
          }
        }
      } catch (error) {
        console.error('Error in checkGeolocationPermission:', error);
        if (isMounted) {
          setLocationError('En feil oppstod ved sjekk av plasseringstilgang');
        }
      } finally {
        if (isMounted) {
          setIsCheckingPermission(false);
        }
      }
    };

    checkGeolocationPermission();
    
    return () => {
      isMounted = false;
    };
  }, [festivals]); // Add festivals to dependency array

  // Function to get user's location and find nearby festivals
  const handleFindNearbyFestivals = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation er ikke støttet av nettleseren din');
      return;
    }
    
    if (!festivals || festivals.length === 0) {
      setLocationError('Ingen festivaler er tilgjengelige for øyeblikket');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('User location:', { latitude, longitude });
      console.log('Total festivals:', festivals.length);
      
      // Log the first few festivals to check their structure
      console.log('Sample festival locations:', festivals.slice(0, 3).map(f => ({
        name: f.name,
        coordinates: f.location?.coordinates
      })));
      
      // Calculate distances and sort festivals by proximity
      const validFestivals: FestivalWithDistance[] = [];
      
      for (const festival of festivals) {
        try {
          if (!festival?.id) {
            console.log('Festival is missing id:', festival);
            continue;
          }
          
          if (!festival?.location?.coordinates) {
            console.log('Festival missing location data:', festival.name);
            continue;
          }
          
          // Try to get coordinates in different possible formats
          let festivalLat: number | null = null;
          let festivalLng: number | null = null;
          
          const coords = festival.location.coordinates as any; // We'll validate the shape
          
          // Handle different coordinate formats
          if (coords && typeof coords === 'object') {
            if ('latitude' in coords && 'longitude' in coords) {
              // Format: { latitude: number, longitude: number }
              festivalLat = Number(coords.latitude);
              festivalLng = Number(coords.longitude);
            } else if ('lat' in coords && 'lng' in coords) {
              // Format: { lat: number | string, lng: number | string }
              festivalLat = typeof coords.lat === 'string' ? parseFloat(coords.lat) : Number(coords.lat);
              festivalLng = typeof coords.lng === 'string' ? parseFloat(coords.lng) : Number(coords.lng);
            }
          } else if (Array.isArray(coords) && coords.length >= 2) {
            // Format: [longitude, latitude] - GeoJSON format
            festivalLng = typeof coords[0] === 'string' ? parseFloat(coords[0]) : Number(coords[0]);
            festivalLat = typeof coords[1] === 'string' ? parseFloat(coords[1]) : Number(coords[1]);
          }
          
          // Validate coordinates
          if (festivalLat === null || festivalLng === null || 
              isNaN(festivalLat) || isNaN(festivalLng) ||
              festivalLat < -90 || festivalLat > 90 || 
              festivalLng < -180 || festivalLng > 180) {
            console.log('Festival has invalid coordinates:', festival.name, coords);
            continue;
          }
            
          const distance = calculateDistance(latitude, longitude, festivalLat, festivalLng);
          
          console.log('Festival distance:', {
            name: festival.name,
            festivalLat,
            festivalLng,
            distance,
            userLat: latitude,
            userLng: longitude
          });
          
          // Create a new object with the required FestivalWithDistance type
          const festivalWithDistance: FestivalWithDistance = {
            ...festival,
            id: festival.id, // Ensure id is included
            location: {
              ...festival.location,
              // Keep all original location properties and override coordinates
              coordinates: coords
            },
            distance
          };
          
          validFestivals.push(festivalWithDistance);
          
        } catch (error) {
          console.error('Error processing festival:', festival.name, error);
          continue;
        }
      }
      
      const festivalsWithDistances = validFestivals;
      
      console.log('Festivals with distances:', festivalsWithDistances);
      
      if (festivalsWithDistances.length === 0) {
        console.error('No festivals with valid coordinates found');
        setLocationError('Fant ingen festivaler med gyldige koordinater');
        return;
      }
      
      // Sort by distance and take the first 3
      const nearestFestivals = [...festivalsWithDistances]
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
        
      console.log('Nearest festivals:', nearestFestivals);
      
      if (nearestFestivals.length === 0) {
        setLocationError('Fant ingen festivaler i nærheten av din plassering');
        return;
      }
      
      // Save to state
      setNearbyFestivals(nearestFestivals);
      setHasLocation(true);
      
      // Save to localStorage for persistence
      localStorage.setItem('userLocation', JSON.stringify({ 
        latitude, 
        longitude,
        timestamp: new Date().toISOString() 
      }));
      localStorage.setItem('nearbyFestivals', JSON.stringify(nearestFestivals));
      
    } catch (error) {
      console.error('Error getting location:', error);
      
      let errorMessage = 'Kunne ikke hente din posisjon. ';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Tilgang til posisjon ble nektet. Vennligst tillat posisjonstilgang i nettleserinnstillingene dine.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Posisjonsinformasjon er ikke tilgjengelig.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Forespørselen om posisjonering tok for lang tid. Vennligst prøv igjen.';
            break;
        }
      } else {
        errorMessage += 'En ukjent feil oppstod.';
      }
      
      setLocationError(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Don't show anything while checking permission to prevent layout shift
  if (isCheckingPermission) {
    return null;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center bg-hero-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/70"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-6xl animate-fade-in">
            <h1 className="text-white mb-6">
              Opplev Norges beste festivaler
            </h1>
            <p className="text-white/90 text-lg mb-8">
            Finn og utforske de mest spennende musikk- og kulturfestivalene i hele Norge.
            </p>
            
            <div className="max-w-2xl w-full mb-10">
              <SearchBar 
                placeholder="Søk etter festivaler, steder eller sjangere..."
                className="w-full"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/festivals" className="btn btn-accent">
                Alle Festivaler
              </Link>
              <Link to="/map" className="btn btn-outline border-white text-white hover:bg-white/10">
                Kart over festivaler
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Festivals Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Populære Festivaler</h2>
              <p className="text-gray-600">Oppdag de mest populære festivalene i hele Norge</p>
            </div>
            <div className="flex items-start sm:items-center">
              <Link to="/festivals" className="text-accent-500 hover:text-accent-600 flex items-center h-full py-2">
                <span className="mr-1">Alle Festivaler</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularFestivals.slice(0, 3).map(festival => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Upcoming Festivals */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Kommende Festivaler</h2>
              <p className="text-gray-600">Planlegg din neste festival opplevelse</p>
            </div>
            <Link to="/calendar" className="text-accent-500 hover:text-accent-600 flex items-center">
              <span className="mr-1">Kalender</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFestivals.slice(0, 4).map(festival => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Festivals Near You Section */}
      <section className="py-16 mb-16">
        <div className="container-custom">
          {!hasLocation ? (
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Finn festivaler i nærheten</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Oppdag festivaler i nærheten av deg for å finne din neste opplevelse
              </p>
              <button
                onClick={handleFindNearbyFestivals}
                disabled={isLoadingLocation}
                className="btn btn-accent inline-flex items-center"
              >
                {isLoadingLocation ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Leter etter festivaler...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Vis festivaler i nærheten
                  </>
                )}
              </button>
            </div>
          ) : locationError ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{locationError}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Festivaler i nærheten av deg</h2>
                <Link to="/map" className="text-accent-500 hover:text-accent-600 flex items-center text-sm mt-2 sm:mt-0">
                  <span className="mr-1">Se alle på kart</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {nearbyFestivals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {nearbyFestivals.map((festival) => (
                    <div key={festival.id} className="relative">
                      <FestivalCard festival={festival} />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center shadow-sm">
                        <MapPin className="w-3 h-3 mr-1 text-accent-500" />
                        {festival.distance < 1 
                          ? `${Math.round(festival.distance * 1000)} m unna` 
                          : `${festival.distance.toFixed(1)} km unna`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">Ingen festivaler funnet i nærheten</p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-primary-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Oppdag, planlegg og nyt</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Festivaler nær deg</h3>
              <p className="text-gray-600">
                Oppdag en samling av musikk- og kulturfestivaler som foregår nær deg.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chat med andre deltagere</h3>
              <p className="text-gray-600">
                Bli med i gruppechatter med andre som skal til samme festivaler.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-600 mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lagre favoritter</h3>
              <p className="text-gray-600">
                Opprett en konto for å lagre festivaler, få personlige anbefalinger, påminnelser og mer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;