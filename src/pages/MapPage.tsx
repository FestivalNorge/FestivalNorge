import React from 'react';
import { festivals as festivalData } from '../data/festivals';
import FestivalMap from '../components/common/FestivalMap';

interface Props {
  festivals?: typeof festivalData;
}

const MapPage: React.FC<Props> = ({ festivals = festivalData }) => {
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
            <FestivalMap 
              festivals={festivals} 
              zoom={5.3} 
              scrollWheelZoom={true}
              center={[60.472, 8.4689]}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;