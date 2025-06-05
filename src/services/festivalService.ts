import { collection, getDocs } from 'firebase/firestore';
import { Festival } from '../types';
import { db } from '../data/firebase';

export const getFestivals = async (): Promise<Festival[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'festivals'));
    const festivals: Festival[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        festivals.push({
          id: doc.id,
          name: data.name || 'Unnamed Festival',
          location: {
            city: data.location?.city || 'Unknown',
            venue: data.location?.venue || 'Unknown Venue',
            region: data.location?.region || 'Unknown Region',
            coordinates: {
              latitude: data.location?.coordinates?.latitude || 0,
              longitude: data.location?.coordinates?.longitude || 0,
            },
          },
          dates: {
            start: data.dates?.start || new Date().toISOString(),
            end: data.dates?.end || new Date().toISOString(),
          },
          price: {
            currency: data.price?.currency || 'NOK',
            dayPass: data.price?.dayPass || 0,
            fullPass: data.price?.fullPass || 0,
          },
          ageLimit: data.ageLimit || 18,
          averageAgeGroup: {
            min: data.averageAgeGroup?.min || 18,
            max: data.averageAgeGroup?.max || 35,
          },
          description: data.description || '',
          genres: Array.isArray(data.genres) ? data.genres : [],
          lineup: Array.isArray(data.lineup) ? data.lineup : [],
          ticketAvailability: ['available', 'limited', 'soldout'].includes(data.ticketAvailability) 
            ? data.ticketAvailability 
            : 'available',
          popularity: typeof data.popularity === 'number' ? data.popularity : 0,
          imageUrl: data.imageUrl || 'https://via.placeholder.com/800x450?text=Festival+Image',
          website: data.website || '',
        });
      }
    });
    
    return festivals;
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return [];
  }
};
