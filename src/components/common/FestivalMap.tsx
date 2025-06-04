import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Festival } from '../../types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface FestivalMapProps {
  festivals: Festival[];
  useCurrentLocation?: boolean;
}

const FestivalMap: React.FC<FestivalMapProps> = ({ festivals, useCurrentLocation = false }) => {
  // Mapbox token would normally come from environment variables
  // For this demo, we'll use a placeholder
  const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';
  
  const [popupInfo, setPopupInfo] = useState<Festival | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 60.3913, // Norway center approximately
    longitude: 5.3221,
    zoom: 5
  });

  // This would be used in a real app with a valid Mapbox token
  React.useEffect(() => {
    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 10
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, [useCurrentLocation]);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden relative shadow-lg">
      {/* For demo purposes, show a placeholder since we don't have a real Mapbox token */}
      <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4 text-center z-10">
        <MapPin className="w-12 h-12 text-primary-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Interactive Festival Map</h3>
        <p className="text-gray-600 mb-4 max-w-md">
          This would be an interactive map showing all festival locations across Norway. 
          Users could click on pins to see festival details and navigate to festival pages.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          {festivals.slice(0, 4).map(festival => (
            <Link 
              key={festival.id} 
              to={`/festival/${festival.id}`}
              className="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center space-x-2"
            >
              <MapPin className="w-5 h-5 text-accent-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">{festival.name}</p>
                <p className="text-xs text-gray-500">{festival.location.city}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* This would be the actual map in a real implementation */}
      {/* <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
        
        {festivals.map(festival => (
          <Marker
            key={festival.id}
            latitude={festival.location.coordinates.latitude}
            longitude={festival.location.coordinates.longitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(festival);
            }}
          >
            <MapPin className="w-8 h-8 text-accent-500 hover:text-accent-600 cursor-pointer" />
          </Marker>
        ))}
        
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.location.coordinates.longitude}
            latitude={popupInfo.location.coordinates.latitude}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            offsetTop={10}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold">{popupInfo.name}</h3>
              <p className="text-sm text-gray-600">{popupInfo.location.venue}, {popupInfo.location.city}</p>
              <Link 
                to={`/festival/${popupInfo.id}`}
                className="text-accent-500 text-sm font-medium hover:underline mt-2 block"
              >
                View Details
              </Link>
            </div>
          </Popup>
        )}
      </Map> */}
    </div>
  );
};

export default FestivalMap;