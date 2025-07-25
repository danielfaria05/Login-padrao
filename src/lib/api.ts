const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is required');
}

export const getApiUrl = () => API_URL;

export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}${endpoint}`;
  return fetch(url, options);
};