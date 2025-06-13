import { useEffect, useState, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, Marker as LeafletMarker } from 'leaflet';
import { Festival } from '../../types';
import { MapPin, LocateFixed } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../../context/LocationContext';

// Fix TypeScript errors
declare module 'leaflet' {
  export interface IconOptions {
    iconUrl: string;
    shadowUrl?: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
    shadowSize?: [number, number];
  }
}

interface FestivalMapProps {
  festivals: Festival[];
  zoom: number;
  scrollWheelZoom: boolean;
  center: [number, number];
  className?: string;
  selectedFestivalId: string | undefined;
  onClick: (id: string) => void;
}

const MapCenter = ({ selectedFestivalId, festivals, userLocation }: { 
  selectedFestivalId: string | undefined, 
  festivals: Festival[],
  userLocation: [number, number] | null 
}) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    
    if (selectedFestivalId) {
      const selectedFestival = festivals.find((f: Festival) => f.id === selectedFestivalId);
      if (selectedFestival) {
        const coordinates = selectedFestival.location.coordinates;
        if (coordinates && typeof coordinates.latitude === 'number' && typeof coordinates.longitude === 'number') {
          const position: [number, number] = [
            coordinates.latitude,
            coordinates.longitude
          ];
          
          // Fly to the position
          map.flyTo(position, 15, {
            duration: 1
          });
          
          // The popup will be opened by the marker's ref callback
        }
      }
    } else if (userLocation) {
      // Center on user location if no festival is selected
      map.flyTo(userLocation, 13);
    }
  }, [selectedFestivalId, festivals, map, userLocation]);

  return null;
};

// Component to locate the user
const LocateControl = () => {
  const map = useMap();
  const { requestLocation, location, locationError } = useLocation();
  const [isLocating, setIsLocating] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Check permission status on mount
  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' as PermissionName })
      .then(permissionStatus => {
        setHasPermission(permissionStatus.state === 'granted');
        
        permissionStatus.onchange = () => {
          setHasPermission(permissionStatus.state === 'granted');
        };
      })
      .catch(() => setHasPermission(false));
  }, []);

  const handleLocate = async () => {
    if (location) {
      // If we already have location, just fly to it
      map.flyTo([location.latitude, location.longitude], 13);
      return;
    }

    // Request location if we don't have it yet
    if (hasPermission !== false) {
      setIsLocating(true);
      try {
        await requestLocation();
      } finally {
        setIsLocating(false);
      }
    }
  };

  // Auto-fly to location when it becomes available
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 13);
    }
  }, [location, map]);

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleLocate}
          className="bg-white p-2 hover:bg-gray-100"
          title="Finn min posisjon"
          disabled={isLocating}
        >
          {isLocating ? (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <LocateFixed className="w-6 h-6 text-blue-600" />
          )}
        </button>
      </div>
      {locationError && (
        <div className="leaflet-control leaflet-bar bg-white p-2 text-red-500 text-sm max-w-[160px]">
          {locationError}
        </div>
      )}
    </div>
  );
};

interface MapRef {
  flyTo: (latlng: [number, number], zoom: number, options: any) => void;
}

const FestivalMap = forwardRef<MapRef, FestivalMapProps>(({
  festivals,
  zoom,
  scrollWheelZoom,
  center,
  className,
  selectedFestivalId,
  onClick
}, ref) => {
  const { location: locCoords } = useLocation();
  const userLocation = useMemo(() => locCoords ? [locCoords.latitude, locCoords.longitude] as [number, number] : null, [locCoords]);

  const defaultIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const selectedIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // User location icon
  const userLocationIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const mapRef = useRef<{ flyTo: (latlng: [number, number], zoom: number, options: any) => void }>(null);
  const selectedMarkerRef = useRef<LeafletMarker | null>(null);

  useImperativeHandle(ref, () => ({
    flyTo: (latlng: [number, number], zoom: number, options: any) => {
      if (mapRef.current) {
        mapRef.current.flyTo(latlng, zoom, options);
      }
    }
  }));

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <MapContainer
        ref={(map) => {
          if (map) {
            // @ts-ignore
            mapRef.current = map;
          }
        }}
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        className="w-full h-full rounded-lg"
      >
        <MapCenter 
          selectedFestivalId={selectedFestivalId} 
          festivals={festivals} 
          userLocation={userLocation}
        />
        <LocateControl />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          errorTileUrl="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
        />
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={userLocationIcon}
          >
            <Popup>Your location</Popup>
          </Marker>
        )}
        
        {/* Festival markers */}
        {festivals.map((festival) => {
          const position: [number, number] = [
            festival.location.coordinates.latitude,
            festival.location.coordinates.longitude
          ];
          console.log('Festival:', festival.name, 'Position:', position);
          // Only show markers with valid coordinates
          if (!position[0] || !position[1]) {
            return null as null;
          }
          const isCurrent = selectedFestivalId && selectedFestivalId === festival.id;
          const icon = isCurrent ? selectedIcon : defaultIcon;

          return (
            <Marker
              key={festival.id}
              position={position}
              icon={icon}
              ref={(ref) => {
                if (ref && isCurrent) {
                  selectedMarkerRef.current = ref;
                  // If this is the selected festival, open its popup
                  setTimeout(() => {
                    if (ref && ref.openPopup) {
                      ref.openPopup();
                    }
                  }, 100);
                }
              }}
              eventHandlers={{
                click: () => festival.id && onClick(festival.id),
                popupopen: () => {
                  if (festival.id) {
                    onClick(festival.id);
                  }
                },
                popupclose: () => {
                  // Clear selection when popup is closed
                  onClick('');
                }
              }}
            >
              <Popup>
                <div className="flex flex-col gap-1 p-1">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-primary-500 flex-shrink-0" />
                    <h3 className="text-base font-semibold leading-tight">{festival.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    {festival.location.city}, {festival.location.region}
                  </p>
                  <p className="text-xs text-gray-600">
                    {festival.dates.start} - {festival.dates.end}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
});

FestivalMap.displayName = 'FestivalMap';

export default FestivalMap;