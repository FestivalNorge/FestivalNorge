import React from 'react';
import { useFestival } from '../context/FestivalContext';
import FestivalMap from '../components/common/FestivalMap';

const MapPage: React.FC = () => {
  const { festivals } = useFestival();

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Festival Map</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-4">
            Find festivals near you or explore events across Norway. Click on markers to see festival details.
          </p>
          <div className="flex items-center">
            <button className="btn btn-primary">
              Find Festivals Near Me
            </button>
            <p className="text-sm text-gray-500 ml-4">
              * Allows access to your location to show nearby festivals
            </p>
          </div>
        </div>
        
        {/* Map Component */}
        <div className="mb-8">
          <FestivalMap festivals={festivals} useCurrentLocation={false} />
        </div>
        
        {/* Festival List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">All Festival Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {festivals.map(festival => (
              <div 
                key={festival.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <h3 className="font-medium text-lg mb-1">{festival.name}</h3>
                <p className="text-gray-600 mb-2">{festival.location.city}, {festival.location.venue}</p>
                <p className="text-sm text-gray-500">
                  {new Date(festival.dates.start).toLocaleDateString()} - {new Date(festival.dates.end).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;