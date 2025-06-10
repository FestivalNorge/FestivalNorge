import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Users, 
  Clock, 
  ExternalLink, 
  Music
} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import FestivalMap from '../components/common/FestivalMap';
import { Festival, FestivalDate } from '../types';

const FestivalDetailPage: React.FC = () => {
  const { id: festivalId } = useParams<{ id: string }>();
  const { getFestivalById, loading: contextLoading } = useFestival();
  const [festival, setFestival] = useState<Festival | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (festivalId) {
      // Only try to get the festival if context is not loading
      if (!contextLoading) {
        const festivalData = getFestivalById(festivalId);
        setFestival(festivalData || null);
        setIsLoading(false);
      }
    }
  }, [festivalId, getFestivalById, contextLoading]);

  // Show loading state if either the context is loading or we're still waiting for the festival data
  const showLoading = contextLoading || (isLoading && !festival);

  if (showLoading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container-custom text-center py-20">
          <h2 className="text-3xl font-bold mb-4">Festival Not Found</h2>
          <p className="text-gray-600 mb-8">
            The festival you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/festivals" className="btn btn-primary">
            Browse All Festivals
          </Link>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Dato ikke tilgjengelig';
    try {
      const date = new Date(dateString);
      if (date.toString() === 'Invalid Date') {
        return 'Ugyldig dato';
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return 'Ugyldig dato';
    }
  };

  const formatDates = (dates: FestivalDate) => {
    const startDate = formatDate(dates.start);
    const endDate = formatDate(dates.end);
    return endDate === startDate ? startDate : `${startDate} - ${endDate}`;
  };

  const getTicketStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'badge-success';
      case 'limited':
        return 'badge-warning';
      case 'soldout':
        return 'badge-error';
      default:
        return 'badge-secondary';
    }
  };

  // Remove the duplicate code block
  // const { id: festivalId } = useParams<{ id: string }>();
  // const { getFestivalById } = useFestival();
  // const [festival, setFestival] = useState<Festival | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (festivalId) {
  //     const festivalData = getFestivalById(festivalId);
  //     setFestival(festivalData || null);
  //     setIsLoading(false);
  //   }
  // }, [festivalId, getFestivalById]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
  //       <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
  //     </div>
  //   );
  // }

  // if (!festival) {
  //   return (
  //     <div className="min-h-screen pt-20 pb-16">
  //       <div className="container-custom text-center py-20">
  //         <h2 className="text-3xl font-bold mb-4">Festival Not Found</h2>
  //         <p className="text-gray-600 mb-8">
  //           The festival you're looking for doesn't exist or has been removed.
  //         </p>
  //         <Link to="/festivals" className="btn btn-primary">
  //           Browse All Festivals
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section with Festival Image */}
      <div className="relative h-[15rem] bg-cover bg-center" style={{ 
        backgroundImage: festival.imageUrl 
          ? `url(${festival.imageUrl})` 
          : 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
        <div className="container-custom relative h-full flex flex-col justify-center pb-8">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            {festival.genres?.map((genre, index) => (
              <span 
                key={index}
                className="badge badge-secondary"
              >
                {genre}
              </span>
            ))}
            {festival.ticketAvailability && (
              <span className={`badge ${getTicketStatusClass(festival.ticketAvailability)}`}>
                {festival.ticketAvailability === 'available' ? 'Tickets Available' : 
                 festival.ticketAvailability === 'limited' ? 'Limited Tickets' : 'Sold Out'}
              </span>
            )}
          </div>
          
          <div>
            <h1 className="text-white mb-4">{festival.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{
                [festival.venue, festival.location.city]
                  .filter(Boolean) // Remove empty strings
                  .join(', ') || 'Location information not available'
              }</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom">
        {/* Quick Info Section */}
        <div className="bg-white rounded-lg shadow-md -mt-6 relative z-10 p-6 mb-8 md:mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-primary-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Dato</p>
              <p className="font-medium">
                {formatDates(festival.dates)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Ticket className="w-8 h-8 text-primary-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Pris</p>
              <p className="font-medium">
                {festival.price?.currency} {festival.price?.dayPass} - {festival.price?.fullPass}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Alder</p>
              <p className="font-medium">{festival.ageLimit || 'Alle aldre'}+</p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Festival Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Om Festivalen</h2>
              <div className="space-y-4">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {festival.about || 'Ingen beskrivelse tilgjengelig'}
                  </p>
                </div>
                {festival.homepages && festival.homepages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Hjemmesider</h3>
                    <div className="flex flex-wrap gap-2">
                      {festival.homepages
                        .filter(homepage => !homepage.includes('ticketmaster'))
                        .map((homepage, index) => (
                          <a
                            key={index}
                            href={homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            {new URL(homepage).hostname}
                          </a>
                        ))}
                    </div>
                    {festival.ticketLink && (
                      <div className="mt-4">
                        <a 
                          href={festival.ticketLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          Billetter
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lineup */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Lineup</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {festival.lineup.map((artist) => (
                  <div 
                    key={artist.name} 
                    className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Music className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <a 
                        href={artist.link || '#' /* Fallback for artists without links */}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary-500"
                      >
                        {artist.name}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Sted</h2>
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 inline-block mr-2 text-primary-500" />
                  {[festival.venue, festival.location.city]
                    .filter(Boolean)
                    .join(', ') || 'Location information not available'}
                </p>
                {festival.location.region && (
                  <p className="text-gray-600">
                    <span className="text-gray-400">Region: </span>
                    {festival.location.region}
                  </p>
                )}
              </div>
              <div className="relative h-[400px] sm:h-[500px] w-full rounded-lg overflow-hidden">
                <div className="h-full w-full">
                  <FestivalMap 
                    festivals={[festival]} 
                    zoom={12} 
                    scrollWheelZoom={true}
                    center={[festival.location.coordinates.latitude, festival.location.coordinates.longitude]}
                    className="h-full w-full"
                    selectedFestivalId={festival.id}
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {festival.ticketLink ? (
                <a 
                  href={festival.ticketLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-accent w-full mb-4 justify-center"
                >
                  Kjøp billetter
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              ) : (
                <button 
                  disabled
                  className="btn btn-accent w-full mb-4 opacity-50 cursor-not-allowed"
                >
                  Billetter ikke tilgjengelig
                </button>
              )}
            </div>
            
            {/* Quick Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Festival Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Datoer</p>
                    <p>{formatDates(festival.dates)}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Ticket className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Billettpriser</p>
                    <p className="text-gray-600">
                      Dagspass: {festival.price.currency} {festival.price.dayPass}
                    </p>
                    <p className="text-gray-600">
                      Festivalpass: {festival.price.currency} {festival.price.fullPass}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Aldersgrense</p>
                    <p className="text-gray-600">{festival.ageLimit}+</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <ExternalLink className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Hjemmesider</p>
                    {festival.homepages?.map((homepage, index) => (
                      <a 
                        key={index}
                        href={homepage} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-accent-500 hover:underline mt-1"
                      >
                        {new URL(homepage).hostname}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex items-start">
                  <Ticket className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Billettlink</p>
                    {festival.ticketLink ? (
                      <a 
                        href={festival.ticketLink.includes('://') ? festival.ticketLink : `https://${festival.ticketLink}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent-500 hover:underline"
                      >
                        {festival.ticketLink.includes('://') ? new URL(festival.ticketLink).hostname : festival.ticketLink}
                      </a>
                    ) : (
                      <span className="text-gray-500">No ticket link available</span>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalDetailPage;