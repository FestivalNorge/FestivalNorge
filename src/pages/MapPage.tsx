import React, { useState } from 'react';
import { useFestival } from '../context/FestivalContext';
import FestivalMap from '../components/common/FestivalMap';

const MapPage: React.FC = () => {
  const { festivals } = useFestival();
  const [useNearby, setUseNearby] = useState(false);
  const [nearbyFestivals, setNearbyFestivals] = useState(festivals);

  // Haversine formula to calculate distance between two coordinates
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (val: number) => (val * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleFindNearby = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const nearby = festivals.filter(f => {
        const festLat = f.location.coordinates.latitude;
        const festLng = f.location.coordinates.longitude;
        return getDistance(userLat, userLng, festLat, festLng) <= 100; // within 100km
      });

      setNearbyFestivals(nearby);
      setUseNearby(true);
    }, () => {
      alert("Location access denied. Showing all festivals.");
      setNearbyFestivals(festivals);
      setUseNearby(false);
    });
  };

  const displayedFestivals = useNearby ? nearbyFestivals : festivals;

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
            <button className="btn btn-primary" onClick={handleFindNearby}>
              {useNearby ? 'Show All Festivals' : 'Find Festivals Near Me'}
            </button>
            <p className="text-sm text-gray-500 ml-4">
              * Allows access to your location to show nearby festivals
            </p>
          </div>
        </div>

        {/* Map Component */}
        <div className="mb-8">
          <FestivalMap festivals={displayedFestivals} useCurrentLocation={useNearby} />
        </div>

        {/* Festival List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">
            {useNearby ? 'Nearby Festivals' : 'All Festival Locations'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedFestivals.map(festival => (
              <div
                key={festival.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <h3 className="font-medium text-lg mb-1">{festival.name}</h3>
                <p className="text-gray-600 mb-2">
                  {festival.location.city}, {festival.location.venue}
                </p>
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



// import React from 'react';
// import { useFestival } from '../context/FestivalContext';
// import FestivalMap from '../components/common/FestivalMap';


// const MapPage: React.FC = () => {
//   const { festivals } = useFestival();



//   return (
//     <div className="min-h-screen pt-20 pb-16">
//       <div className="container-custom">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Festival Map</h1>
//           <p className="text-lg text-gray-600 max-w-3xl mb-4">
//             Find festivals near you or explore events across Norway. Click on markers to see festival details.
//           </p>
//           <div className="flex items-center">
//             <button className="btn btn-primary">
//               Find Festivals Near Me
//             </button>
//             <p className="text-sm text-gray-500 ml-4">
//               * Allows access to your location to show nearby festivals
//             </p>
//           </div>
//         </div>
        
//         {/* Map Component */}
//         <div className="mb-8">
//           <FestivalMap festivals={festivals} useCurrentLocation={false} />
//         </div>
        
//         {/* Festival List */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-2xl font-bold mb-4">All Festival Locations</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {festivals.map(festival => (
//               <div 
//                 key={festival.id}
//                 className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
//               >
//                 <h3 className="font-medium text-lg mb-1">{festival.name}</h3>
//                 <p className="text-gray-600 mb-2">{festival.location.city}, {festival.location.venue}</p>
//                 <p className="text-sm text-gray-500">
//                   {new Date(festival.dates.start).toLocaleDateString()} - {new Date(festival.dates.end).toLocaleDateString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapPage;