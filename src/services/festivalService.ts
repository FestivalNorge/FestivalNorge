import { collection, getDocs } from 'firebase/firestore';
import { Festival } from '../types';
import { db } from '../data/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

// Helper function to transform raw festival data
export const transformFestivalData = (raw: any): Festival => {
  // Parse dates
  const parseNorwegianDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const dateParts = raw.dates.split(' – ');
  const startDate = parseNorwegianDate(dateParts[0]);
  const endDate = dateParts[1] ? parseNorwegianDate(dateParts[1]) : startDate;

  // Parse location
  const venueParts = raw.venue.split(',');
  const city = venueParts.length > 1 ? venueParts[1].trim() : '';
  const venueName = venueParts[0].trim();

  // Parse price
  const price = raw.price || 0;

  // Parse lineup
  const lineup = raw.lineup?.map((artist: { name: string; link: string }) => ({
    name: artist.name,
    genre: '',
    headliner: false
  })) || [];

  return {
    id: crypto.randomUUID(),
    name: raw.name || '',
    dates: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
    location: {
      city: city || '',
      venue: venueName || '',
      region: '', // Not provided in the data
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    lineup,
    price: {
      currency: 'NOK',
      dayPass: price,
      fullPass: price
    },
    ageLimit: 18, // From the description
    description: raw.description || '',
    about: raw.about || '',
    homepages: raw.homepages || [],
    detailsLink: raw.details_link || '',
    ticketLink: raw.ticket_link || '',
    website: raw.homepages?.[0] || '',
    imageUrl: raw.image_url || '',
    popularity: 0,
    genres: []
  };
};

// Rest of the file remains the same...

export const getFestivals = async (): Promise<Festival[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'festivals'));
    console.log('Successfully fetched festivals:', querySnapshot.size);
    const festivals: Festival[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        console.log('Processing festival:', doc.id, data.name);
        festivals.push({
          id: doc.id,
          name: data.name || 'Unnamed Festival',
          location: {
            city: data.location?.city || '',
            venue: data.location?.venue || '',
            region: data.location?.region || '',
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
          averageAgeGroup: data.averageAgeGroup || {
            min: 18,
            max: 35
          },
          description: data.description || '',
          about: data.about || '',
          homepages: data.homepages || [],
          detailsLink: data.detailsLink || '',
          ticketLink: data.ticketLink || '',
          website: data.website || '',
          genres: Array.isArray(data.genres) ? data.genres : [],
          lineup: Array.isArray(data.lineup) ? data.lineup : [],
          ticketAvailability: ['available', 'limited', 'soldout'].includes(data.ticketAvailability) 
            ? data.ticketAvailability 
            : 'available',
          popularity: typeof data.popularity === 'number' ? data.popularity : 0,
          imageUrl: data.imageUrl || 'https://via.placeholder.com/800x450?text=Festival+Image'
        });
      }
    });
    
    return festivals;
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return [];
  }
};
