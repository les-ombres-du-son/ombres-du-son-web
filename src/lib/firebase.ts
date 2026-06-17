import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Configuration Firebase
// Firestore (default) : quiz_pre_installation, quiz_final, Users/{uid}/Games
// Realtime Database : active_sessions, sessions temps réel
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY ,
  authDomain:
    import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'les-ombres-du-son-483614.firebaseapp.com',
  databaseURL: 'https://les-ombres-du-son-483614-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'les-ombres-du-son-483614',
  storageBucket:
    import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'les-ombres-du-son-483614.firebasestorage.app',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '346375999456',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '1:346375999456:web:a55854253619c92070e585',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure auth persistence
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Explicitement la base (default) pour être cohérent avec l'app mobile
export const db = getFirestore(app, '(default)');
export const rtdb = getDatabase(app); // Realtime Database (service différent)

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
