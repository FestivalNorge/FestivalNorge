require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = require('./firebaseConfig.cjs');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fs = require('fs').promises;
const path = require('path');

const main = async () => {
  try {
    // Read the JSON file
    const festivalsPath = path.join(__dirname, '../src/data/festivals_with_price.json');
    const festivalsData = await fs.readFile(festivalsPath, 'utf-8');
    const festivals = JSON.parse(festivalsData);

    // Upload each festival
    for (const festival of festivals) {
      const docRef = await addDoc(collection(db, 'festivals'), festival);
      console.log(`Successfully added festival ${festival.name} with ID:`, docRef.id);
    }
  } catch (error) {
    console.error('Error uploading festivals:', error);
    process.exit(1);
  }
};

main();
