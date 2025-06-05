import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Festival } from '../types';
import { festivals as festivalData } from '../data/festivals';
import { Link } from 'react-router-dom';
import FestivalCard from '../components/common/FestivalCard';

// Fix for missing default marker icons
const icon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Set up custom icon for all markers
L.Marker.prototype.options.icon = icon;

type Props = {
  festivals?: Festival[];
};

const FestivalMap: React.FC<Props> = ({ festivals }) => {
  const center: [number, number] = [60.472, 8.4689]; // Center of Norway

  // If no festivals prop is provided, use the default festival data
  const finalFestivals = festivals || festivalData;

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Festivalkart</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Se festivaler på kartet over Norge. Trykk på markørene for mer informasjon.
          </p>
        </div>
      </div>
      
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-md px-6 py-8 mb-12">
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
                  <Marker key={festival.id} position={[latitude, longitude]}>
                    <Popup>
                      <div className="w-64">
                        <h3 className="font-bold text-lg mb-1">{festival.id === '1' ? 'Øya Festivalen' : festival.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{festival.location.venue}, {festival.location.city}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          {new Date(festival.dates.start).toLocaleDateString('no-NO')} - {new Date(festival.dates.end).toLocaleDateString('no-NO')}
                        </p>
                        <Link 
                          to={`/festival/${festival.id}`}
                          className="text-primary-500 hover:underline text-sm font-medium"
                        >
                          Se detaljer →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalMap;