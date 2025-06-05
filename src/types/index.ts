export interface Festival {
  id: string;
  name: string;
  location: {
    city: string;
    venue: string;
    region: string; // Added region for better location filtering
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  dates: {
    start: string;
    end: string;
  };
  price: {
    currency: string;
    dayPass: number;
    fullPass: number;
  };
  ageLimit: number;
  averageAgeGroup: {
    min: number;
    max: number;
  };
  description: string;
  genres: string[];
  lineup: Artist[];
  ticketAvailability: 'available' | 'limited' | 'soldout';
  popularity: number;
  imageUrl: string;
  website: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  imageUrl?: string;
  headliner?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  savedFestivals: string[];
}

export type SortOption = 'popularity' | 'date' | 'price' | 'location';
export type FilterOption = 'all' | string; // genre or other filter type
export type LocationFilter = 'all' | string; // region filter