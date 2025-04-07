import { auth } from '../firebase-config';

const API_URL = import.meta.env.VITE_API_URL || 'https://build-ai-backend.vercel.app';

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
    const response = await fetch(`${API_URL}/api/digests/categories/list`);
    
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

/**
 * Fetch available sources and their counts
 */
export const fetchSources = async () => {
  try {
    const baseUrl = API_URL;
    const response = await fetch(`${baseUrl}/api/digests/sources/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sources');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    return [];
  }
};

/**
 * Fetch digests with optional filters
 * @param {Object} options - Filter options (category, source, page, limit, etc.)
 * @param {string} [token] - Optional auth token for authenticated requests
 * @returns {Promise<Object>} Digests and pagination data
 */
export const fetchDigests = async (options = {}, token = null) => {
  try {
    // Build query string from options
    const queryParams = new URLSearchParams();
    
    // Add all options as query parameters
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request with the correct endpoint path
    const response = await fetch(`${API_URL}/api/digests?${queryParams.toString()}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch digests');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching digests:', error);
    return { digests: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
  }
};

/**
 * Fetch personalized digests based on user preferences
 * @param {Object} options - Filter options (category, source, page, limit, etc.)
 * @param {string} token - Auth token for the request
 * @returns {Promise<Object>} Personalized digests and pagination data
 */
export const fetchPersonalizedDigests = async (options = {}, token) => {
  try {
    if (!token) {
      throw new Error('Authentication required for personalized digests');
    }
    
    // Build query string from options
    const queryParams = new URLSearchParams();
    
    // Add all options as query parameters
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    // Make the request with the correct endpoint path
    const response = await fetch(`${API_URL}/api/digests/personalized?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch personalized digests');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching personalized digests:', error);
    return { digests: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
  }
};

/**
 * Fetch a single digest by ID
 * @param {string} id - The digest ID to fetch
 * @param {string} [token] - Optional auth token
 * @returns {Promise<Object>} The digest data
 */
export const fetchDigestById = async (id, token = null) => {
  try {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request with the correct endpoint path
    const response = await fetch(`${API_URL}/api/digests/${id}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch digest');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching digest ${id}:`, error);
    throw error;
  }
};

/**
 * Add a digest to user's read history
 * @param {string} digestId - The digest ID to add to history
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Updated read history
 */
export const addToReadHistory = async (digestId, token) => {
  try {
    if (!token) {
      throw new Error('Authentication required to update read history');
    }
    
    const response = await fetch(`${API_URL}/user/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ digestId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update read history');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating read history:', error);
    throw error;
  }
};

/**
 * Fetch user profile data
 * @param {string} token - Auth token
 * @returns {Promise<Object>} User profile data
 */
export const fetchUserProfile = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication required to fetch user profile');
    }
    
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
