import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, getDocs } from "firebase/firestore";

import firebaseConfigJson from "../../../firebase-applet-config.json";

const firebaseConfig = {
  projectId: firebaseConfigJson.projectId,
  appId: firebaseConfigJson.appId,
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
};

export const app = initializeApp(firebaseConfig);

const databaseId = firebaseConfigJson.firestoreDatabaseId;
export const db = (databaseId && databaseId !== "(default)")
  ? getFirestore(app, databaseId)
  : getFirestore(app);

// Store Settings helper
export async function syncStoreSettingsToFirestore(settings) {
  try {
    const settingsRef = doc(db, "store_settings", "global");
    await setDoc(settingsRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn("Firestore sync store_settings error (falling back to localStorage):", err);
  }
}

export function subscribeStoreSettingsFromFirestore(callback) {
  try {
    const settingsRef = doc(db, "store_settings", "global");
    return onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    }, (err) => {
      console.warn("Firestore snapshot error:", err);
    });
  } catch (err) {
    console.warn("Firestore subscription error:", err);
    return () => {};
  }
}
