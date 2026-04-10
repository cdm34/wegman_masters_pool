import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUzixxUJP3Q7dk23NJtjKqIXhqQKyjYV0",
  authDomain: "masters-2026-a9644.firebaseapp.com",
  projectId: "masters-2026-a9644",
  storageBucket: "masters-2026-a9644.firebasestorage.app",
  messagingSenderId: "19874039791",
  appId: "1:19874039791:web:ef1a739e3375fae740581a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// We will use a single document to store the latest fetched leaderboard payload
const COLLECTION_NAME = "poolData";
const DOCUMENT_NAME = "leaderboard";

/**
 * Saves the latest RapidAPI payload to Firestore.
 * This runs after a successful API fetch.
 */
window.saveToFirebase = async (data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    // Write data along with a server timestamp if needed, but we'll stick to Date.now() for JS logic
    await setDoc(docRef, {
      payload: data,
      timestamp: Date.now()
    });
    console.log("[Firebase] Successfully saved latest scores to Firestore");
  } catch (error) {
    console.error("[Firebase] Error writing to Firestore:", error);
  }
};

/**
 * Loads the latest cached payload from Firestore.
 * This is attempted on page load.
 */
window.loadFromFirebase = async () => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("[Firebase] Successfully loaded scores from Firestore database. Timestamp:", new Date(data.timestamp).toLocaleString());
      return data; // Returns { payload: {...}, timestamp: ... }
    } else {
      console.log("[Firebase] No cached scores found in Firestore database");
      return null;
    }
  } catch (error) {
    console.error("[Firebase] Error reading from Firestore:", error);
    return null;
  }
};
