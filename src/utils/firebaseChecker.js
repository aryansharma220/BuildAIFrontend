import { auth } from '../firebase-config';

/**
 * Utility to check Firebase initialization and configuration
 */
export const checkFirebaseConfig = async () => {
  console.log('=== FIREBASE CONFIGURATION CHECK ===');
  
  // Check environment variables
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  
  // Check if environment variables are set
  const configCheck = Object.entries(firebaseConfig).map(([key, value]) => ({
    key,
    set: !!value,
    // Only show partial values for security
    preview: value ? `${value.substring(0, 3)}...${value.substring(value.length - 3)}` : null
  }));
  
  console.log('Firebase Config Check:', configCheck);
  
  // Check auth initialization
  const isAuthInitialized = !!auth;
  console.log('Firebase Auth Initialized:', isAuthInitialized);
  
  // Check if we can connect to Firebase
  try {
    // Try to get current auth state (doesn't need authentication)
    const currentUser = auth.currentUser;
    console.log('Firebase Auth Connection: Success');
    console.log('Current User:', currentUser ? 'Signed In' : 'Not Signed In');
    
    return {
      status: 'success',
      configCheck,
      isAuthInitialized,
      connected: true,
      currentUser: !!currentUser
    };
  } catch (error) {
    console.error('Firebase Connection Error:', error);
    
    return {
      status: 'error',
      configCheck,
      isAuthInitialized,
      connected: false,
      error: error.message
    };
  }
};

// Make this available in the console for debugging
if (typeof window !== 'undefined') {
  window.checkFirebaseConfig = checkFirebaseConfig;
}
