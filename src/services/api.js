import { auth } from '../firebase-config';

const API_URL = import.meta.env.VITE_API_URL || 'https://build-ai-backend.vercel.app/api';

/**
 * Makes an authenticated API request
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<any>} - The API response
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    // Get the current user
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the ID token
    const token = await user.getIdToken(true);
    
    // Set up headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    // Make the request
    const response = await fetch(`${API_URL}/${endpoint.replace(/^\//, '')}`, {
      ...options,
      headers
    });
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json') 
      ? await response.json() 
      : await response.text();
    
    // Handle non-200 responses
    if (!response.ok) {
      console.error(`API Error: ${response.status}`, data);
      throw new Error(data.message || data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = () => {
  return apiRequest('user/profile', { method: 'GET' });
};

/**
 * Create or update user profile
 * @param {Object} profileData - Profile data to save
 * @returns {Promise<Object>} Updated profile data
 */
export const updateUserProfile = (profileData) => {
  return apiRequest('user/profile', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });
};

/**
 * Get user preferences
 * @returns {Promise<Object>} User preferences
 */
export const getUserPreferences = () => {
  return apiRequest('user/preferences', { method: 'GET' });
};

/**
 * Update user preferences
 * @param {Object} preferences - Preferences to save
 * @returns {Promise<Object>} Updated preferences
 */
export const updateUserPreferences = (preferences) => {
  return apiRequest('user/preferences', {
    method: 'POST',
    body: JSON.stringify(preferences)
  });
};

/**
 * Fetch categories
 * @returns {Promise<Array>} List of categories
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
