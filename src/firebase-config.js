import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Log when in development (helps with debugging)
if (import.meta.env.DEV) {
  console.log("Firebase config loaded with:", {
    apiKeyExists: !!firebaseConfig.apiKey,
    projectId: firebaseConfig.projectId
  });
}

// Check if Firebase config is valid
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete. Check your environment variables.');
}

// Initialize Firebase immediately, before any exports
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set up auth persistence
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("Auth persistence set to LOCAL");
  } catch (error) {
    console.error("Error during persistence setup:", error);
  }
})();

// Add token refresh event listener to help with auth issues
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // Force refresh token on each sign-in
    try {
      const token = await user.getIdToken(true);
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }
});

// Export the initialized Firebase app and auth
export { app, auth };

// Export the Firebase auth functions so they can be imported in AuthContext
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  updateProfile
};
