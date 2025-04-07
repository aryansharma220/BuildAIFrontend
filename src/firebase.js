// Re-export everything from firebase-config.js to maintain compatibility
export { 
  app, 
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  updateProfile
} from './firebase-config';

// Display migration message during development
if (import.meta.env.DEV) {
  console.warn('firebase.js is deprecated. Please import directly from firebase-config.js');
}
