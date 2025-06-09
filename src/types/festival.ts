export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  city: string;
  venue: string;
  region: string;
  coordinates: Coordinates;
}

export interface FestivalDate {
  start: string;
  end: string;
}

export interface Price {
  currency: string;
  dayPass: number;
  fullPass: number;
}

export interface AgeGroup {
  min: number;
  max: number;
}

export interface Artist {
  id?: string;
  name: string;
  genre: string;
  headliner?: boolean;
  link?: string;
}

export interface Festival {
  id?: string;
  name: string;
  location: Location;
  dates: FestivalDate;
  price: Price;
  ageLimit: number;
  averageAgeGroup?: AgeGroup;
  description: string;
  about: string;
  homepages: string[];
  detailsLink: string;
  ticketLink: string;
  genres: string[];
  lineup: Artist[];
  ticketAvailability?: string;
  popularity: number;
  imageUrl: string;
  website: string;
  featured?: boolean;
  tags?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FestivalFilters {
  searchQuery?: string;
  location?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  priceRange?: string[];
  genre?: string[];
  tags?: string[];
}

export interface FestivalPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FestivalResponse {
  data: Festival[];
  pagination: FestivalPagination;
}
