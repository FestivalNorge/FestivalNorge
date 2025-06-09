import { Festival } from '../types/festival';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../data/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

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

  // Handle venue parsing safely
  const location = {
    ...defaultLocation,
    ...(raw.venue ? {
      venue: raw.venue,
      city: '', // Leave city empty since we're only using venue
      region: ''
    } : {
      venue: '',
      city: ''
    })
  };

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

  return {
    id: raw.id || uuidv4(),
    name: raw.name || '',
    about: raw.about || '',
    location: location,
    dates: dates,
    price: price,
    ageLimit: raw.ageLimit || 18,
    description: raw.description || '',
    homepages: Array.isArray(raw.homepages) ? raw.homepages : [],
    detailsLink: raw.details_link || '',
    ticketLink: raw.ticket_link || '',
    website: raw.website || '',
    genres: raw.genres || [],
    lineup: Array.isArray(raw.lineup) ? raw.lineup.map((artist: { name: string; link: string }) => ({
      name: artist.name || '',
      genre: '',
      headliner: false,
      link: artist.link || ''
    })) : [],
    ticketAvailability: 'available',
    popularity: 0,
    imageUrl: raw.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="100%25" height="100%25" fill="black"/%3E%3C/svg%3E',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false
  } as Festival;
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
