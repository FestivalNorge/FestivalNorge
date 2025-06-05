import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Festival } from '../types';
import { festivals as festivalData } from '../data/festivals';
import FestivalCard from '../components/common/FestivalCard';

// Fix for missing default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up custom icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  iconSize: [25, 41]
});

// Fix for missing default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Props = {
  festivals?: Festival[];
};

const FestivalMap: React.FC<Props> = ({ festivals }) => {
  const center: [number, number] = [60.472, 8.4689]; // Center of Norway

  // If no festivals prop is provided, use the default festival data
  const finalFestivals = festivals || festivalData;

  return (
    <div className="bg-white rounded-lg shadow-md px-6 py-8 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Festival Map</h2>
      <div className="h-[400px] sm:h-[500px] w-full rounded-lg overflow-hidden">
        <MapContainer center={center} zoom={5.3} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Dynamic festival markers */}
          {finalFestivals.map((festival: Festival) => {
            if (!festival || !festival.location || !festival.location.coordinates) {
              console.error('Invalid festival data:', festival);
              return null;
            }

            const { latitude, longitude } = festival.location.coordinates;
            return (
              <Marker key={festival.id} position={[latitude, longitude]} icon={customIcon}>
                <Popup>
                  <div className="max-w-[300px] p-6 text-gray-900">
                    <Link to={`/festival/${festival.id}`} className="block w-full">
                      <FestivalCard festival={festival} simplified />
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