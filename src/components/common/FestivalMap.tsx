import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Festival } from '../../types';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Create custom icons
const greenIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [35, 51],
  iconAnchor: [17, 51],
  popupAnchor: [1, -44],
  shadowSize: [51, 51]
});

interface FestivalMapProps {
  festivals: Festival[];
  zoom?: number;
  center?: [number, number];
  scrollWheelZoom?: boolean;
  className?: string;
  selectedFestivalId?: string;
  onClick?: (id: string) => void;
}

const FestivalMap: React.FC<FestivalMapProps> = ({
  festivals = [],
  zoom = 5.3,
  center = [60.472, 8.4689],
  scrollWheelZoom = true,
  className = '',
  selectedFestivalId = '',
  onClick
}) => {
  // Debug log to check the festivals data
  console.log('Festivals in map component:', festivals);
  
  // Return early if no festivals or invalid center coordinates
  if (!Array.isArray(festivals) || !center || center.length !== 2) {
    console.log('No valid festivals or center coordinates');
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p>Laster kart...</p>
      </div>
    );
  }

  // Add a unique key to prevent multiple renders
  const mapKey = `map-${center.join(',')}-${zoom}-${selectedFestivalId}`;

  // Ensure the map container has proper height
  React.useEffect(() => {
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer instanceof HTMLElement) {
      mapContainer.style.height = '100%';
    }
  }, []);

  return (
    <div key={mapKey} className={`relative w-full ${className || ''}`}>
      <div className="h-full">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={scrollWheelZoom}
          style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

            {festivals.map((festival) => {
              if (!festival || !festival.location || !festival.location.coordinates) {
                console.error('Invalid festival data:', festival);
                return null;
              }

              const { latitude, longitude } = festival.location.coordinates;
              const isCurrentFestival = festival.id === selectedFestivalId;
              return (
                <Marker 
                  key={festival.id} 
                  position={[latitude, longitude]} 
                  icon={isCurrentFestival ? blueIcon : greenIcon}
                  eventHandlers={{
                    click: () => onClick?.(festival.id)
                  }}
                >
                  <Popup>
                    <div className="max-w-[300px] p-6 text-gray-900">
                      <Link to={`/festival/${festival.id}`} className="block w-full">
                        <div className="flex items-center space-x-2">
                          <div className="text-primary-500">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{festival.name}</h3>
                            <p className="text-sm text-gray-600">
                              {festival.location.venue}, {festival.location.city}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(festival.dates.start).toLocaleDateString('no-NO')} - {new Date(festival.dates.end).toLocaleDateString('no-NO')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default FestivalMap;