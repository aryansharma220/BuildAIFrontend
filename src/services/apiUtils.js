/**
 * Utility functions for API requests
 */

// Get base API URL with consistent formatting
export const getBaseApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://build-ai-backend.vercel.app';
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

// Default request options with authentication
export const getRequestOptions = (method, token, body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    // Don't use credentials:include as it requires specific CORS setup
    credentials: 'same-origin'
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
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Server responded with ${response.status}` };
    }
    
    console.error('API Error:', {
      status: response.status,
      url: response.url,
      error: errorData
    });
    
    throw new Error(errorData.message || `Server responded with ${response.status}`);
  }
  
  try {
    return await response.json();
  } catch (e) {
    console.warn('Response is not JSON, returning raw response');
    return { success: true, message: 'Operation completed' };
  }
};

// Wrapper for API calls with consistent error handling
export const apiRequest = async (url, options) => {
  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, options);
    return handleApiResponse(response);
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};
