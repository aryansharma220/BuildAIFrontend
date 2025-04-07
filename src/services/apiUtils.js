/**
 * Utility functions for API requests
 */

// Get base API URL with consistent formatting
export const getBaseApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

// Default request options with authentication
export const getRequestOptions = (method, token, body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: import.meta.env.VITE_ALLOW_CREDENTIALS === 'true' ? 'include' : 'same-origin'
  };
  
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return options;
};

// Helper to handle API responses consistently
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `Server responded with ${response.status}`
    }));
    
    console.error('API Error:', {
      status: response.status,
      url: response.url,
      error
    });
    
    throw new Error(error.message || `Server responded with ${response.status}`);
  }
  
  return response.json();
};

// Wrapper for API calls with consistent error handling
export const apiRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    return handleApiResponse(response);
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};
