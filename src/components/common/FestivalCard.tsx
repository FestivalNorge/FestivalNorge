import React from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, Ticket, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Festival } from '../../types';
import i18n from '@/config/i18n';

interface FestivalCardProps {
  festival: Festival;
  featured?: boolean;
  isSelected?: boolean;
  showDistance?: boolean;
  showGenres?: boolean;
  distance?: number;
  onClick?: (festival: Festival) => void;
}

const FestivalCard: React.FC<FestivalCardProps> = ({ 
  festival, 
  featured = false, 
  isSelected = false,
  showDistance = false,
  showGenres = true,
  distance,
  onClick
}) => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || i18n.language;
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d');
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

  const getDistanceText = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m unna`;
    } else {
      return `${distance.toFixed(1)} km unna`;
    }
  };

  return (
    <div 
      className={`card group overflow-hidden cursor-pointer rounded-lg ${
        featured ? 'flex flex-col md:flex-row max-h-[400px]' : 'flex flex-col'
      }`}
      style={isSelected ? { boxShadow: '0 0 0 4px #ff5722' } : {}}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(festival);
        } else {
          // Use React Router's navigate with language prefix
          navigate(`/${currentLang}/festival/${festival.id}`);
        }
      }}
    >
      <div 
        className={`relative rounded-t-lg overflow-hidden ${
          featured ? 'md:w-1/2 h-64 md:h-full md:rounded-l-lg md:rounded-tr-none' : 'h-96'
        }`}
      >
        <img 
          src={festival.imageUrl} 
          alt={festival.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent flex flex-col p-4">
          <h3 className="text-xl font-extrabold text-white group-hover:text-accent-300 transition-colors drop-shadow-md mb-2">
            {festival.name}
          </h3>
          <div className="mt-auto">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {festival.ticketAvailability && (
                  <span className={`badge ${getTicketStatusClass(festival.ticketAvailability)}`}>
                    {festival.ticketAvailability === 'available' ? 'Tickets Available' : 
                     festival.ticketAvailability === 'limited' ? 'Limited Tickets' : 'Sold Out'}
                  </span>
                )}
                {festival.averageAgeGroup && (
                  <span className="badge bg-primary-100 text-primary-800">
                    {festival.averageAgeGroup.min}-{festival.averageAgeGroup.max} år
                  </span>
                )}
              </div>
              {showDistance && (
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center shadow-sm">
                  <MapPin className="w-3 h-3 mr-1 text-accent-500" />
                  {distance !== undefined ? getDistanceText(distance) : 'Distance not available'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-5 ${featured ? 'md:w-1/2' : ''} pt-3`}>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-primary-500" />
            <span>{festival.venue}</span>
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

          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2 text-primary-500" />
            <span>{festival.ageLimit}+ år</span>
          </div>
        </div>

        {showGenres && festival.genres.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {festival.genres.slice(0, 4).map((genre, index) => (
                <span key={index} className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                  {genre}
                </span>
              ))}
              {festival.genres.length > 4 && (
                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  +{festival.genres.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
        
        {featured && (
          <div className="mt-4">
            <span className="text-accent-500 font-medium group-hover:underline">
              View Festival Details
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalCard;