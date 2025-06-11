import { Festival } from '../types/festival';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../data/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { Coordinates } from '../types';

// Helper function to transform raw festival data
export const transformFestivalData = (raw: any): Festival => {
  // Safe default values
  const defaultLocation = {
    city: '',
    venue: '',
    region: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    }
  };

  // Handle location and coordinates parsing safely
  const location = {
    ...defaultLocation,
    ...(raw.location ? {
      // Don't include venue here as it's now at the root level
      city: raw.location.city || '',
      region: raw.location.region || '',
      coordinates: {
        latitude: raw.location.coordinates?.latitude || 0,
        longitude: raw.location.coordinates?.longitude || 0
      }
    } : {
      city: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    })
  };
  
  // Get venue from root level or default to empty string
  const venue = raw.venue || '';

  // Parse dates from string format
  const parseDate = (dateStr: string): Date => {
    try {
      if (!dateStr) return new Date();
      
      // Handle different date formats
      const parts = dateStr.split(' – ');
      const datePart = parts[0];
      
      // Extract location if present
      const locationParts = datePart.split(' ');
      const datePartWithoutLocation = locationParts[locationParts.length - 1];
      
      // Extract day and month
      const [day, month] = datePartWithoutLocation.split('/');
      
      // Extract year from the second part if it exists
      const year = parts.length > 1 ? parts[1].split('/')[2] : '2025';
      
      if (!day || !month) {
        console.warn('Invalid date format:', dateStr);
        return new Date();
      }
      
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateStr);
        return new Date();
      }
      return date;
    } catch (error) {
      console.warn('Error parsing date:', dateStr, error);
      return new Date();
    }
  };

  // Parse dates string
  const dates = typeof raw.dates === 'string' ? {
    start: parseDate(raw.dates).toISOString(),
    end: raw.dates.includes(' – ') 
      ? parseDate(raw.dates.split(' – ')[1]).toISOString() 
      : parseDate(raw.dates).toISOString()
  } : {
    start: new Date().toISOString(),
    end: new Date().toISOString()
  };

  // Handle price
  const price = typeof raw.price === 'number' ? {
    currency: 'NOK',
    dayPass: raw.price,
    fullPass: raw.price
  } : {
    currency: 'NOK',
    dayPass: 0,
    fullPass: 0
  };

  // Create the festival object with all required fields
  const festival: Festival = {
    id: raw.id || uuidv4(),
    name: raw.name || 'Unnamed Festival',
    venue: venue,
    location: location,
    dates: dates,
    price: price,
    ageLimit: raw.ageLimit || 18,
    description: raw.description || '',
    about: raw.about || '',
    homepages: Array.isArray(raw.homepages) ? raw.homepages : [],
    detailsLink: raw.detailsLink || '',
    ticketLink: raw.ticketLink || '',
    genres: Array.isArray(raw.genres) ? raw.genres : [],
    lineup: Array.isArray(raw.lineup) ? raw.lineup : [],
    ticketAvailability: raw.ticketAvailability || 'unknown',
    popularity: raw.popularity || 0,
    imageUrl: raw.imageUrl || '',
    website: raw.website || '',
    featured: raw.featured || false,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date()
  };

  // Add optional fields if they exist
  if (raw.averageAgeGroup) {
    festival.averageAgeGroup = raw.averageAgeGroup;
  }
  if (raw.tags) {
    festival.tags = raw.tags;
  }

  return festival;
};

// Function to fetch all festivals from Firestore
export const getFestivals = async (): Promise<Festival[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'festivals'));
    if (!querySnapshot) return [];
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return transformFestivalData({
        ...data,
        id: doc.id,
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date()
      });
    });
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return [];
  }
};

export const getFestivalById = async (id: string): Promise<Festival | null> => {
  try {
    if (!id) return null;
    
    const docRef = doc(db, 'festivals', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    if (!data) return null;
    
    return transformFestivalData({
      ...data,
      id: docSnap.id,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    });
  } catch (error) {
    console.error('Error fetching festival:', error);
    return null;
  }
};



// Calculate Haversine distance in km
export const calculateDistance = (
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export interface FestivalWithDistance extends Festival {
  distance: number;
}

export const getNearbyFestivals = async (
  userLocation: Coordinates,
  maxDistanceKm: number = 50
): Promise<FestivalWithDistance[]> => {
  const all = await getFestivals();
  const withDistances = all.map(f => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      f.location.coordinates.latitude,
      f.location.coordinates.longitude
    );
    return { ...f, distance };
  });
  
  return withDistances
    .filter(f => f.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance);
};