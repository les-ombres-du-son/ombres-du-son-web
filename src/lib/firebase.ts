import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase
// Firestore : pour les quiz (pré-installation et final)
// Realtime Database : pour les sessions de jeu en temps réel (utilisée par l'app mobile)
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || 'AIzaSyBFddo819BtJAYQp0PP6E3AghaUsLToZrg',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'les-ombres-du-son-483614.firebaseapp.com',
  projectId: 'les-ombres-du-son-483614',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || 'les-ombres-du-son-483614.firebasestorage.app',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '346375999456',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '1:346375999456:android:10432424e200db1f70e585'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
