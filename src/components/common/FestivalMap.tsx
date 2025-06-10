import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Festival } from '../../types';
import { MapPin, LocateFixed } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

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
          map.flyTo(position, 12);
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
const LocateControl = ({ onLocated }: { onLocated: (position: [number, number]) => void }) => {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userPosition: [number, number] = [latitude, longitude];
        onLocated(userPosition);
        map.flyTo(userPosition, 13);
        setIsLocating(false);
      },
      (err) => {
        console.error('Error getting location:', err);
        setError('Unable to retrieve your location');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={handleLocate}
          className="bg-white p-2 hover:bg-gray-100"
          title="Find my location"
          disabled={isLocating}
        >
          {isLocating ? (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <LocateFixed className="w-6 h-6 text-blue-600" />
          )}
        </button>
      </div>
      {error && (
        <div className="leaflet-control leaflet-bar bg-white p-2 text-red-500 text-sm">
          {error}
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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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

  const mapRef = useRef<any>(null);

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
        <LocateControl onLocated={setUserLocation} />
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
              eventHandlers={{
                click: () => festival.id && onClick(festival.id)
              }}
            >
              <Popup>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} />
                    <h3 className="font-semibold">{festival.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {festival.location.city}, {festival.location.region}
                  </p>
                  <p className="text-sm text-gray-600">
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