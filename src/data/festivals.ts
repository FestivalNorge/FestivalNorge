import { Festival } from '../types';

// Mock data for festivals
export const festivals: Festival[] = [
  {
    id: '1',
    name: 'Øya Festival',
    location: {
      city: 'Oslo',
      venue: 'Tøyenparken',
      region: 'Eastern Norway',
      coordinates: {
        latitude: 59.9167,
        longitude: 10.7667
      }
    },
    dates: {
      start: '2025-08-06',
      end: '2025-08-09'
    },
    price: {
      currency: 'NOK',
      dayPass: 1200,
      fullPass: 3200
    },
    ageLimit: 18,
    averageAgeGroup: {
      min: 20,
      max: 35
    },
    description: 'Øya Festival is one of Norway\'s largest and most popular music festivals, featuring a diverse lineup of local and international artists. The festival is known for its focus on sustainability and eco-friendly practices.',
    genres: ['Rock', 'Pop', 'Electronic', 'Hip-hop'],
    lineup: [
      { id: 'a1', name: 'Aurora', genre: 'Pop', headliner: true },
      { id: 'a2', name: 'Sigrid', genre: 'Pop', headliner: true },
      { id: 'a3', name: 'Röyksopp', genre: 'Electronic', headliner: true },
      { id: 'a4', name: 'Karpe', genre: 'Hip-hop' },
      { id: 'a5', name: 'Issa Gold', genre: 'Hip-hop' },
      { id: 'a6', name: 'Charlotte Dos Santos', genre: 'Soul' }
    ],
    ticketAvailability: 'available',
    popularity: 98,
    imageUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    website: 'https://oyafestivalen.no/'
  },
  {
    id: '2',
    name: 'Bergenfest',
    location: {
      city: 'Bergen',
      venue: 'Bergenhus Fortress',
      region: 'Western Norway',
      coordinates: {
        latitude: 60.3913,
        longitude: 5.3221
      }
    },
    dates: {
      start: '2025-06-11',
      end: '2025-06-14'
    },
    price: {
      currency: 'NOK',
      dayPass: 950,
      fullPass: 2800
    },
    ageLimit: 18,
    averageAgeGroup: {
      min: 18,
      max: 30
    },
    description: 'Bergenfest is an annual music festival that takes place in Bergen, Norway. The festival features international and Norwegian artists and bands, and is held at the historic Bergenhus Fortress.',
    genres: ['Rock', 'Indie', 'Pop', 'Folk'],
    lineup: [
      { id: 'b1', name: 'Tame Impala', genre: 'Psychedelic Rock', headliner: true },
      { id: 'b2', name: 'Astrid S', genre: 'Pop' },
      { id: 'b3', name: 'Girl in Red', genre: 'Indie' },
      { id: 'b4', name: 'Dagny', genre: 'Pop' }
    ],
    ticketAvailability: 'limited',
    popularity: 85,
    imageUrl: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg',
    website: 'https://www.bergenfest.no/'
  },
  {
    id: '3',
    name: 'Piknik i Parken',
    location: {
      city: 'Oslo',
      venue: 'Sofienbergparken',
      region: 'Eastern Norway',
      coordinates: {
        latitude: 59.9255,
        longitude: 10.7649
      }
    },
    dates: {
      start: '2025-06-26',
      end: '2025-06-28'
    },
    price: {
      currency: 'NOK',
      dayPass: 850,
      fullPass: 2100
    },
    ageLimit: 18,
    averageAgeGroup: {
      min: 25,
      max: 40
    },
    description: 'Piknik i Parken (PiP) is a boutique festival that combines music, food, and art in a beautiful park setting. The festival has a relaxed atmosphere and focuses on quality over quantity.',
    genres: ['Indie', 'Folk', 'Alternative', 'Electronic'],
    lineup: [
      { id: 'c1', name: 'Highasakite', genre: 'Indie Pop', headliner: true },
      { id: 'c2', name: 'Wardruna', genre: 'Folk' },
      { id: 'c3', name: 'Susanne Sundfør', genre: 'Art Pop' },
      { id: 'c4', name: 'Cashmere Cat', genre: 'Electronic' }
    ],
    ticketAvailability: 'available',
    popularity: 75,
    imageUrl: 'https://images.pexels.com/photos/1209982/pexels-photo-1209982.jpeg',
    website: 'https://www.piknikparken.no/'
  },
  {
    id: '4',
    name: 'Moldejazz',
    location: {
      city: 'Molde',
      venue: 'Various venues in Molde',
      region: 'Central Norway',
      coordinates: {
        latitude: 62.7374,
        longitude: 7.1588
      }
    },
    dates: {
      start: '2025-07-13',
      end: '2025-07-18'
    },
    price: {
      currency: 'NOK',
      dayPass: 750,
      fullPass: 2500
    },
    ageLimit: 18,
    averageAgeGroup: {
      min: 30,
      max: 55
    },
    description: 'Moldejazz is one of Europe\'s oldest jazz festivals, founded in 1961. The festival takes place in the picturesque town of Molde and features performances by jazz artists from around the world.',
    genres: ['Jazz', 'Blues', 'World Music'],
    lineup: [
      { id: 'd1', name: 'Tord Gustavsen Trio', genre: 'Jazz', headliner: true },
      { id: 'd2', name: 'Bugge Wesseltoft', genre: 'Jazz' },
      { id: 'd3', name: 'Hedvig Mollestad Trio', genre: 'Jazz Rock' },
      { id: 'd4', name: 'Arild Andersen', genre: 'Jazz' }
    ],
    ticketAvailability: 'available',
    popularity: 70,
    imageUrl: 'https://images.pexels.com/photos/811838/pexels-photo-811838.jpeg',
    website: 'https://www.moldejazz.no/'
  },
  {
    id: '5',
    name: 'Tons of Rock',
    location: {
      city: 'Oslo',
      venue: 'Ekebergparken',
      region: 'Eastern Norway',
      coordinates: {
        latitude: 59.8794,
        longitude: 10.7662
      }
    },
    dates: {
      start: '2025-06-25',
      end: '2025-06-27'
    },
    price: {
      currency: 'NOK',
      dayPass: 1050,
      fullPass: 2750
    },
    ageLimit: 18,
    averageAgeGroup: {
      min: 16,
      max: 35
    },
    description: 'Tons of Rock is Norway\'s biggest rock and metal festival. It features a mix of international and Norwegian artists across multiple stages.',
    genres: ['Rock', 'Metal', 'Hard Rock', 'Punk'],
    lineup: [
      { id: 'e1', name: 'Metallica', genre: 'Metal', headliner: true },
      { id: 'e2', name: 'Ghost', genre: 'Hard Rock', headliner: true },
      { id: 'e3', name: 'Kvelertak', genre: 'Metal' },
      { id: 'e4', name: 'Enslaved', genre: 'Black Metal' }
    ],
    ticketAvailability: 'limited',
    popularity: 92,
    imageUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    website: 'https://www.tonsofrock.no/'
  }
];

export default festivals;