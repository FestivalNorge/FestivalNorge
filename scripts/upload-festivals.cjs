require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, updateDoc, doc } = require('firebase/firestore');

const firebaseConfig = require('./firebaseConfig.cjs');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fs = require('fs').promises;
const path = require('path');

async function main() {
  try {
    // Read the JSON file
    const festivalsPath = path.join(__dirname, '../src/data/festivals_with_coords.json');
    const festivalsData = await fs.readFile(festivalsPath, 'utf-8');
    const festivals = JSON.parse(festivalsData);
    
    // Get all existing festivals
    const querySnapshot = await getDocs(collection(db, 'festivals'));
    const existingFestivals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Update each festival
    for (const festival of festivals) {
      // Find existing festival by name
      const existingFestival = existingFestivals.find(f => f.name === festival.name);
      
      if (existingFestival) {
        // Update the existing festival with new coordinates if they exist
        // Check if festival has coordinates in the JSON
        if (festival.coordinates && festival.coordinates.latitude && festival.coordinates.longitude) {
          // Update the existing festival with new coordinates
          await updateDoc(doc(db, 'festivals', existingFestival.id), {
            'location.coordinates': {
              latitude: festival.coordinates.latitude,
              longitude: festival.coordinates.longitude
            }
          });
          console.log(`✅ Updated coordinates for festival ${festival.name}`);
        } else {
          console.log(`❌ No coordinates found for festival ${festival.name}`);
        }
      } else {
        // If festival doesn't exist, create a new one
        const docRef = await addDoc(collection(db, 'festivals'), festival);
        console.log(`Successfully added new festival ${festival.name} with ID:`, docRef.id);
      }
    }
  } catch (error) {
    console.error('Error uploading festivals:', error);
    process.exit(1);
  }
}

// Run the main function
main();
