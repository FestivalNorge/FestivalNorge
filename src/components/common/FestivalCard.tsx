import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Calendar, Ticket, Heart } from 'lucide-react';
import { Festival } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface FestivalCardProps {
  festival: Festival;
  featured?: boolean;
}

const FestivalCard: React.FC<FestivalCardProps> = ({ festival, featured = false }) => {
  const { isAuthenticated, user, saveFestival, removeSavedFestival } = useAuth();
  
  const isSaved = user?.savedFestivals.includes(festival.id) || false;
  
  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) return;
    
    if (isSaved) {
      removeSavedFestival(festival.id);
    } else {
      saveFestival(festival.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
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
    <Link 
      to={`/festival/${festival.id}`} 
      className={`card group festival-card-hover ${
        featured ? 'flex flex-col md:flex-row overflow-hidden max-h-[400px]' : ''
      }`}
    >
      <div 
        className={`relative ${
          featured ? 'md:w-1/2 h-64 md:h-full' : 'h-48'
        } overflow-hidden`}
      >
        <img 
          src={festival.imageUrl} 
          alt={festival.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className={`badge ${getTicketStatusClass(festival.ticketAvailability)}`}>
                {festival.ticketAvailability === 'available' ? 'Tickets Available' : 
                 festival.ticketAvailability === 'limited' ? 'Limited Tickets' : 'Sold Out'}
              </span>
            </div>
            {isAuthenticated && (
              <button 
                onClick={handleSaveToggle}
                className={`p-2 rounded-full ${
                  isSaved 
                    ? 'bg-accent-500 text-white' 
                    : 'bg-white/30 backdrop-blur-sm text-white hover:bg-white/50'
                } transition-colors`}
                aria-label={isSaved ? "Remove from saved" : "Save festival"}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className={`p-5 ${featured ? 'md:w-1/2' : ''}`}>
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent-500 transition-colors">
            {festival.name}
          </h3>
          <div className="flex items-center space-x-1 bg-primary-50 text-primary-700 px-2 py-1 rounded text-sm">
            <span>{festival.popularity}</span>
            <span>/100</span>
          </div>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-primary-500" />
            <span>{festival.location.city}, {festival.location.venue}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-primary-500" />
            <span>
              {formatDate(festival.dates.start)} - {formatDate(festival.dates.end)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2 text-primary-500" />
            <span>{festival.price.currency} {festival.price.dayPass} - {festival.price.fullPass}</span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {festival.genres.map((genre, index) => (
            <span 
              key={index}
              className="badge badge-secondary"
            >
              {genre}
            </span>
          ))}
        </div>
        
        {featured && (
          <p className="mt-3 text-gray-600 line-clamp-3">
            {festival.description}
          </p>
        )}
        
        {featured && (
          <div className="mt-4">
            <span className="text-accent-500 font-medium group-hover:underline">
              View Festival Details
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default FestivalCard;