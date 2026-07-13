// Base URL for our custom Node.js Express server
export const API_BASE_URL = 'http://localhost:5000/api';

// Utility helper to keep fetch code clean and standard across the app
export const fetchFromAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the server request.');
  }
  
  return data;
};