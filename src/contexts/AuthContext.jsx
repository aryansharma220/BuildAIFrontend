import { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from '../firebase-config';
import toast from 'react-hot-toast'; 

// Create auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState(null);
  
  // Get a fresh token
  const refreshToken = async (user) => {
    if (!user) return null;
    
    try {
      // Force token refresh to ensure we have the latest one
      await user.getIdToken(true);
      const token = await user.getIdToken();
      console.log("Token refreshed successfully");
      setUserToken(token);
      return token;
    } catch (err) {
      console.error('Error refreshing token:', err);
      // Handle specific Firebase errors
      if (err.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection.');
      } else if (err.code === 'auth/user-token-expired') {
        // Force user to log in again
        toast.error('Your session has expired. Please sign in again.');
        await signOut(auth);
      }
      return null;
    }
  };
  
  // Setup periodic token refresh (every 30 minutes)
  const setupTokenRefresh = (user) => {
    if (tokenRefreshTimer) {
      clearInterval(tokenRefreshTimer);
    }
    
    if (user) {
      // Refresh token every 30 minutes (tokens typically expire after 1 hour)
      const timer = setInterval(() => refreshToken(user), 30 * 60 * 1000);
      setTokenRefreshTimer(timer);
    }
  };
  
  // Signup function
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Get ID token for API calls
      const token = await refreshToken(userCredential.user);
      
      // Setup token refresh
      setupTokenRefresh(userCredential.user);
      
      return userCredential.user;
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle specific Firebase errors with user-friendly messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try another.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to create account');
      }
      
      throw err;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get ID token for API calls with forced refresh
      const token = await refreshToken(userCredential.user);
      
      // Setup token refresh
      setupTokenRefresh(userCredential.user);
      
      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific Firebase errors with user-friendly messages
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError(err.message || 'Failed to log in');
      }
      
      throw err;
    }
  };
  
  // Google sign in
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get ID token for API calls with forced refresh
      const token = await refreshToken(userCredential.user);
      
      // Setup token refresh
      setupTokenRefresh(userCredential.user);
      
      return userCredential.user;
    } catch (err) {
      console.error('Google sign-in error:', err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
      
      throw err;
    }
  };
  
  // Logout function
  const logout = () => {
    if (tokenRefreshTimer) {
      clearInterval(tokenRefreshTimer);
      setTokenRefreshTimer(null);
    }
    setUserToken(null);
    return signOut(auth);
  };
  
  // Check API health without authentication
  const checkApiHealth = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://build-ai-backend.vercel.app';
      const healthUrl = `${apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl}/health`;
      
      console.log(`Checking API health at: ${healthUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      const data = await response.json().catch(() => ({ status: 'error parsing response' }));
      console.log('API health check result:', { status: response.status, data });
      
      return { status: response.status, data };
    } catch (error) {
      console.error('Error checking API health:', error);
      return { status: 'error', error: error.message };
    }
  };
  
  // Effect for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get fresh token
          const token = await refreshToken(user);
          
          // Setup token refresh
          setupTokenRefresh(user);
        } catch (err) {
          console.error('Error getting user token:', err);
        }
      } else {
        if (tokenRefreshTimer) {
          clearInterval(tokenRefreshTimer);
          setTokenRefreshTimer(null);
        }
        setUserToken(null);
      }
      
      setLoading(false);
    });
    
    return () => {
      unsubscribe();
      if (tokenRefreshTimer) {
        clearInterval(tokenRefreshTimer);
      }
    };
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tokenRefreshTimer) {
        clearInterval(tokenRefreshTimer);
      }
    };
  }, []);
  
  const value = {
    currentUser,
    userToken,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    logout,
    refreshToken,
    checkApiHealth
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
