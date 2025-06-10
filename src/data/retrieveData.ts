import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Din firestore initialisering

async function exportFestivalNamesToCsv() {
  try {
    const snapshot = await getDocs(collection(db, "festivals"));
    const names = snapshot.docs.map(doc => doc.data().name).filter(Boolean);

    if (!names.length) {
      console.error("Ingen festivalnavn funnet.");
      return;
    }

    // Lag CSV-innhold
    const csvContent = "data:text/csv;charset=utf-8," + names.join("\n");

    // Opprett en nedlastingslenke
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "festival_names.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`Eksporterte ${names.length} festivalnavn til festival_names.csv`);
  } catch (error) {
    console.error("Kunne ikke eksportere festivalnavn:", error);
  }
}

// Kjør funksjonen ved behov, f.eks. etter en knappetrykk
exportFestivalNamesToCsv();