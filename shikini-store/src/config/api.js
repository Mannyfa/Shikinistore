export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://shikini-api.onrender.com/api' // Make sure this is your EXACT Render URL
  : 'http://localhost:5000/api';

export const fetchFromAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Ensure we always request JSON
  const headers = {
    'Accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  // Handle empty responses (like standard DELETE or PUT returns)
  if (response.status === 204) return null;

  const text = await response.text();
  
  // 🚨 ANTI-VERCEL-TRAP
  // If Vercel intercepts a broken link, it returns the index.html file. 
  // This explicitly catches that and throws a loud error instead of failing silently.
  if (text.trim().startsWith('<') || text.includes('<!DOCTYPE html>')) {
    console.error("Vercel Routing Trap Detected. Received HTML instead of JSON from:", url);
    throw new Error('API request was intercepted by frontend routing. Check your Render API_BASE_URL.');
  }

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("Failed to parse JSON response:", text);
    throw new Error('Received invalid data format from the vault server.');
  }

  if (!response.ok) {
    throw new Error(data.message || `Vault Error: ${response.statusText}`);
  }

  return data;
};