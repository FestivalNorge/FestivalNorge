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
  
  // Function to check if we have permission to access location
  const checkPermission = useCallback(async () => {
    if (!('permissions' in navigator)) return 'prompt';
    
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      permissionStatusRef.current = permissionStatus;
      return permissionStatus.state;
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      return 'prompt';
    }
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

  // Cleanup function
  useEffect(() => {
    return () => {
      stopWatching();
      if (permissionStatusRef.current) {
        permissionStatusRef.current.onchange = null;
      }
    };
  }, [stopWatching]);

  // Function to manually request location
  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      const error = new Error('Geolocation is not supported');
      setLocationError(error.message);
      throw error;
    }

    // Check permission first
    const permission = await checkPermission();
    if (permission === 'denied') {
      const error = new Error('Permission to access location was denied');
      setLocationError(getGeolocationErrorMessage({ code: 1 } as GeolocationPositionError));
      throw error;
    }

    return new Promise<Coordinates>((resolve, reject) => {
      // First try with high accuracy, but shorter timeout
      const tryGetPosition = (attempts = 0) => {
        const isHighAccuracy = attempts < 2; // Only try high accuracy twice
        const timeout = isHighAccuracy ? 10000 : 20000; // 10s for high accuracy, 20s for low
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            handlePositionUpdate(position);
            // Start watching position after successful location
            startWatching();
            resolve(coords);
          },
          (error) => {
            if (attempts < 1) {
              // Try again with lower accuracy
              tryGetPosition(attempts + 1);
            } else {
              const errorMsg = getGeolocationErrorMessage(error);
              setLocationError(errorMsg);
              reject(new Error(errorMsg));
            }
          },
          {
            enableHighAccuracy: isHighAccuracy,
            timeout,
            maximumAge: isHighAccuracy ? 0 : 5 * 60 * 1000 // 0 for high accuracy, 5 min for low
          }
        );
      };

      tryGetPosition(0);
    });
  }, [handlePositionUpdate, checkPermission, startWatching]);

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