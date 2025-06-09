import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { transformFestivalData } from '../src/services/festivalService';

const festivalData = {
  name: "Parkenfestivalen",
  dates: "14/06/2025 – 18/06/2025",
  venue: "Parken, Oslo",
  price: 2500,
  description: "Parkenfestivalen er en av Norges største musikkfestivaler med en rekke av internasjonale og norske artister.",
  about: "Parkenfestivalen har vært en fast verdi i norsk festival-landskap siden 2010. Festivalen er kjent for sin varierende musikkprogrammering og gode atmosfære.",
  homepages: [
    "https://www.parkenfestivalen.no",
    "https://www.facebook.com/parkenfestivalen"
  ],
  details_link: "https://www.parkenfestivalen.no/billetter",
  ticket_link: "https://www.ticketmaster.no/parkenfestivalen",
  image_url: "https://example.com/parkenfestivalen.jpg",
  lineup: [
    {
      name: "The Weeknd",
      link: "https://www.theweeknd.com"
    },
    {
      name: "Calvin Harris",
      link: "https://www.calvinharris.com"
    },
    {
      name: "Kygo",
      link: "https://www.kygo.com"
    }
  ]
};

const main = async () => {
  try {
    // Transform the raw data
    const festival = transformFestivalData(festivalData);
    console.log('Transformed festival data:', festival);

    // Add to Firebase
    const docRef = await addDoc(collection(db, 'festivals'), festival);
    console.log('Successfully added festival with ID:', docRef.id);
  } catch (error) {
    console.error('Error uploading festival:', error);
    process.exit(1);
  }
};

main();
