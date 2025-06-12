// src/context/LocationContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Coordinates } from '../types';

interface LocationContextType {
  location: Coordinates | null;
  locationError: string | null;
  requestLocation: () => Promise<Coordinates>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Coordinates | null>(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);
  const permissionStatusRef = useRef<PermissionStatus | null>(null);

  // Function to handle successful position updates
  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    const coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    setLocation(coords);
    localStorage.setItem('userLocation', JSON.stringify(coords));
  }, []);

  // Function to handle position errors
  const handlePositionError = useCallback((error: GeolocationPositionError) => {
    const errorMsg = getGeolocationErrorMessage(error);
    setLocationError(errorMsg);
    console.error('Geolocation error:', error);
  }, []);

  // Function to start watching position
  const startWatching = useCallback(() => {
    if (watchId.current !== null) return;

    watchId.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handlePositionError,
      {
        enableHighAccuracy: true,
        maximumAge: 5 * 60 * 1000, // 5 minutes
        timeout: 10000
      }
    );
  }, [handlePositionError, handlePositionUpdate]);

  // Function to stop watching position
  const stopWatching = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  // Check for existing permission and start watching if granted
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    const checkAndWatch = async () => {
      try {
        // Check if permission is already granted
        const permissionStatus = await navigator.permissions.query({ 
          name: 'geolocation' as PermissionName 
        });
        permissionStatusRef.current = permissionStatus;

        if (permissionStatus.state === 'granted') {
          startWatching();
        }

        // Handle permission changes
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            startWatching();
          } else {
            stopWatching();
            setLocation(null);
            localStorage.removeItem('userLocation');
          }
        };
      } catch (error) {
        console.error('Error checking geolocation permission:', error);
      }
    };

    checkAndWatch();

    // Cleanup function
    return () => {
      stopWatching();
      if (permissionStatusRef.current) {
        permissionStatusRef.current.onchange = null;
      }
    };
  }, [startWatching, stopWatching]);

  // Function to manually request location
  const requestLocation = useCallback(() => {
    return new Promise<Coordinates>((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported');
        setLocationError(error.message);
        reject(error);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          handlePositionUpdate(position);
          resolve(coords);
        },
        (error) => {
          const errorMsg = getGeolocationErrorMessage(error);
          setLocationError(errorMsg);
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Force fresh location
        }
      );
    });
  }, [handlePositionUpdate]);

  return (
    <LocationContext.Provider value={{ 
      location, 
      locationError,
      requestLocation 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

// Error message helper
function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Du må tillate tilgang til posisjon for å se festivaler i nærheten.';
    case error.POSITION_UNAVAILABLE:
      return 'Posisjonsinformasjon er ikke tilgjengelig.';
    case error.TIMEOUT:
      return 'Forespørselen om posisjonering tok for lang tid.';
    default:
      return 'En feil oppstod ved henting av posisjon.';
  }
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};