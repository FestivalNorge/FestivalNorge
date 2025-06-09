import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Festival } from '../../types';
import { MapPin } from 'lucide-react';
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

const MapCenter = ({ selectedFestivalId, festivals }: { selectedFestivalId: string | undefined, festivals: Festival[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    if (selectedFestivalId) {
      const selectedFestival = festivals.find((f: Festival) => f.id === selectedFestivalId);
      if (selectedFestival) {
        const position: [number, number] = [
          selectedFestival.location.coordinates.latitude,
          selectedFestival.location.coordinates.longitude
        ];
        map.flyTo(position, 12);
      }
    }
  }, [selectedFestivalId, festivals, map]);

  return null;
};

const FestivalMap = ({
  festivals,
  zoom,
  scrollWheelZoom,
  center,
  className,
  selectedFestivalId,
  onClick
}: FestivalMapProps) => {
  const getMarkerPosition = (festival: Festival): LatLngExpression => {
    return [
      festival.location.coordinates.latitude,
      festival.location.coordinates.longitude
    ];
  };

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

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      className={className}
      style={{ position: 'relative', zIndex: 30 }}
    >
      <MapCenter selectedFestivalId={selectedFestivalId} festivals={festivals} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {festivals.map((festival) => {
        const position = getMarkerPosition(festival);
        const isCurrent = selectedFestivalId === festival.id;
        const icon = isCurrent ? selectedIcon : defaultIcon;

        return (
          <Marker
            key={festival.id}
            position={position}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (festival.id) {
                  onClick(festival.id);
                }
              }
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
  );
};

export default FestivalMap;