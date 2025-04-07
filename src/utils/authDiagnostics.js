import { auth } from '../firebase-config';
import { getBaseApiUrl } from '../services/apiUtils';

const API_URL = getBaseApiUrl();

/**
 * A utility to diagnose authentication issues
 */
export const runAuthDiagnostics = async () => {
  console.log('=== AUTH DIAGNOSTICS ===');
  
  // Check if user is signed in
  const user = auth.currentUser;
  console.log('User signed in:', !!user);
  
  if (!user) {
    console.log('No user is currently signed in. Please sign in first.');
    return {
      status: 'not-authenticated',
      message: 'No user is signed in'
    };
  }
  
  // Check user details
  console.log('User details:', {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    providerId: user.providerId,
    isAnonymous: user.isAnonymous
  });
  
  // Get ID token
  try {
    const token = await user.getIdToken(true);
    console.log('Token successfully retrieved, length:', token.length);
    console.log('Token preview:', token.substring(0, 20) + '...');
    
    // Try to verify token
    console.log('Trying token verification endpoint...');
    
    const response = await fetch(`${API_URL}/api/auth/token-debug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    const result = await response.json();
    console.log('Token verification result:', result);
    
    // Try to check server health
    console.log('Checking server health...');
    const healthResponse = await fetch(`${API_URL}/api/system/health`);
    const healthResult = await healthResponse.json();
    console.log('Server health:', healthResult);
    
    // Try to check CORS
    console.log('Testing CORS...');
    const corsResponse = await fetch(`${API_URL}/api/system/cors-test`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const corsResult = await corsResponse.json();
    console.log('CORS test result:', corsResult);
    
    return {
      status: 'completed',
      token: {
        available: true,
        length: token.length
      },
      verification: result,
      serverHealth: healthResult,
      cors: corsResult
    };
  } catch (error) {
    console.error('Auth diagnostics error:', error);
    return {
      status: 'error',
      message: error.message,
      stack: error.stack
    };
  } finally {
    console.log('=== END DIAGNOSTICS ===');
  }
};

// Function to manually test the user profile endpoint
export const testUserProfileEndpoint = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('No user is signed in');
      return { status: 'error', message: 'Not authenticated' };
    }
    
    const token = await user.getIdToken(true);
    console.log('Testing user profile endpoint with token');
    
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', {
      'content-type': response.headers.get('content-type'),
      'access-control-allow-origin': response.headers.get('access-control-allow-origin')
    });
    
    const data = await response.text();
    console.log('Raw response:', data);
    
    try {
      const jsonData = JSON.parse(data);
      return { status: 'success', data: jsonData };
    } catch (e) {
      return { status: 'error', message: 'Failed to parse JSON', rawData: data };
    }
  } catch (error) {
    console.error('Test endpoint error:', error);
    return { status: 'error', message: error.message };
  }
};

// Export for use in console for debugging
window.runAuthDiagnostics = runAuthDiagnostics;
window.testUserProfileEndpoint = testUserProfileEndpoint;
