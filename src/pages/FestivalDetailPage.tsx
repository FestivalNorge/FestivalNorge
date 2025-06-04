import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Users, 
  Clock, 
  Heart, 
  ExternalLink, 
  Music,
  Star
} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import { useAuth } from '../context/AuthContext';
import FestivalMap from '../components/common/FestivalMap';
import { Festival } from '../types';

const FestivalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFestivalById } = useFestival();
  const { isAuthenticated, user, saveFestival, removeSavedFestival } = useAuth();
  const [festival, setFestival] = useState<Festival | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const festivalData = getFestivalById(id);
      setFestival(festivalData || null);
      setIsLoading(false);
    }
  }, [id, getFestivalById]);
  
  if (isLoading) {
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
  
  const isSaved = user?.savedFestivals.includes(festival.id) || false;
  
  const handleSaveToggle = () => {
    if (!isAuthenticated) return;
    
    if (isSaved) {
      removeSavedFestival(festival.id);
    } else {
      saveFestival(festival.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  const getTicketStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success-100 text-success-800';
      case 'limited':
        return 'bg-warning-100 text-warning-800';
      case 'soldout':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section with Festival Image */}
      <div className="relative h-80 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url(${festival.imageUrl})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
        <div className="container-custom relative h-full flex flex-col justify-end pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {festival.genres.map((genre, index) => (
              <span 
                key={index}
                className="badge badge-secondary"
              >
                {genre}
              </span>
            ))}
            <span className={`badge ${getTicketStatusClass(festival.ticketAvailability)}`}>
              {festival.ticketAvailability === 'available' ? 'Tickets Available' : 
               festival.ticketAvailability === 'limited' ? 'Limited Tickets' : 'Sold Out'}
            </span>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-white mb-2">{festival.name}</h1>
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{festival.location.city}, {festival.location.venue}</span>
              </div>
            </div>
            
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
              <Star className="w-4 h-4 mr-1.5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{festival.popularity}</span>
              <span className="text-sm text-white/70 ml-1">/100</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom">
        {/* Quick Info Section */}
        <div className="bg-white rounded-lg shadow-md -mt-6 relative z-10 p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-primary-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Dates</p>
              <p className="font-medium">
                {formatDate(festival.dates.start)} - {formatDate(festival.dates.end)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Ticket className="w-8 h-8 text-primary-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Price Range</p>
              <p className="font-medium">
                {festival.price.currency} {festival.price.dayPass} - {festival.price.fullPass}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Age Limit</p>
              <p className="font-medium">{festival.ageLimit}+</p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Festival Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About the Festival</h2>
              <p className="text-gray-700 leading-relaxed">{festival.description}</p>
            </div>
            
            {/* Lineup */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Lineup</h2>
              
              {/* Headliners */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-primary-700">Headliners</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {festival.lineup
                    .filter(artist => artist.headliner)
                    .map(artist => (
                      <div 
                        key={artist.id} 
                        className="bg-primary-50 rounded-lg p-4 flex items-center space-x-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center">
                          <Music className="w-5 h-5 text-primary-700" />
                        </div>
                        <div>
                          <p className="font-medium">{artist.name}</p>
                          <p className="text-sm text-gray-600">{artist.genre}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Other Artists */}
              <h3 className="text-lg font-semibold mb-3 text-primary-700">Artists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {festival.lineup
                  .filter(artist => !artist.headliner)
                  .map(artist => (
                    <div 
                      key={artist.id} 
                      className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Music className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-sm text-gray-600">{artist.genre}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <p className="text-gray-700 mb-4">
                <MapPin className="w-5 h-5 inline-block mr-2 text-primary-500" />
                {festival.location.venue}, {festival.location.city}
              </p>
              <FestivalMap festivals={[festival]} />
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {festival.ticketAvailability !== 'soldout' ? (
                <a 
                  href={festival.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-accent w-full mb-4 justify-center"
                >
                  Buy Tickets
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              ) : (
                <button 
                  disabled
                  className="btn btn-accent w-full mb-4 opacity-50 cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}
              
              {isAuthenticated ? (
                <button 
                  onClick={handleSaveToggle}
                  className={`btn w-full justify-center ${
                    isSaved 
                      ? 'bg-white border-accent-500 text-accent-500 hover:bg-accent-50'
                      : 'btn-outline'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-accent-500' : ''}`} />
                  {isSaved ? 'Saved to My Festivals' : 'Save to My Festivals'}
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-outline w-full justify-center"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Login to Save
                </Link>
              )}
            </div>
            
            {/* Quick Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Festival Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">
                      {Math.ceil((new Date(festival.dates.end).getTime() - new Date(festival.dates.start).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Ticket className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Ticket Options</p>
                    <p className="text-gray-600">
                      Day Pass: {festival.price.currency} {festival.price.dayPass}
                    </p>
                    <p className="text-gray-600">
                      Full Festival: {festival.price.currency} {festival.price.fullPass}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Age Restriction</p>
                    <p className="text-gray-600">{festival.ageLimit}+ years</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <ExternalLink className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Official Website</p>
                    <a 
                      href={festival.website} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-500 hover:underline"
                    >
                      {festival.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
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