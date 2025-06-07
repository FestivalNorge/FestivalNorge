export type {
  Festival,
  FestivalFilters,
  FestivalPagination,
  FestivalResponse,
  Location,
  FestivalDate,
  Price,
  AgeGroup,
  Artist
} from './festival';

export type SortOption = 'name' | 'date' | 'popularity' | 'price' | 'location';
export type FilterOption = string;
export type LocationFilter = 'all' | string; // region filter