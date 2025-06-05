import React, { useState } from 'react';
import defaultFestivals from '../data/festivals';
import FestivalMap from '../components/common/FestivalMap';
import { Festival } from '../types';
import FestivalCard from '../components/common/FestivalCard';

interface Props {
  festivals?: Festival[];
}

const MapPage: React.FC<Props> = ({ festivals = defaultFestivals }) => {
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null);

  // Sort festivals with selected one at top
  const sortedFestivals = [...festivals].sort((a, b) => {
    const aSelected = a.id === selectedFestival;
    const bSelected = b.id === selectedFestival;
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

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
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8">
          {/* Map section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Kart</h2>
              <div className="h-[400px] sm:h-[500px] w-full rounded-lg overflow-hidden relative bg-white">
                <FestivalMap 
                  festivals={festivals} 
                  zoom={5.3} 
                  scrollWheelZoom={true}
                  center={[60.472, 8.4689]}
                  className="w-full h-full relative"
                  selectedFestivalId={selectedFestival}
                  onClick={(id) => setSelectedFestival(id)}
                />
              </div>
            </div>
          </div>

          {/* Festival list section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Festivaler</h2>
              <div className="space-y-4">
                {sortedFestivals.map((festival) => (
                  <div 
                    key={festival.id} 
                    className={`cursor-pointer transition-colors ${
                      festival.id === selectedFestival ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedFestival(festival.id)}
                  >
                    <FestivalCard festival={festival} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;