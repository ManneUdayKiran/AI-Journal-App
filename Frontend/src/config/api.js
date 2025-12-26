// API Configuration
// Change this to switch between local and production backends

const API_CONFIG = {
  // Set to 'local' for development, 'production' for deployed backend
  environment: "production",

  endpoints: {
    local: "http://localhost:8000/api",
    production: "https://ai-journal-app.onrender.com/api",
  },
};

// Get the current API base URL
export const API_BASE_URL = API_CONFIG.endpoints[API_CONFIG.environment];

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login`,
  signup: `${API_BASE_URL}/auth/signup`,

  // Journal endpoints
  createEntry: `${API_BASE_URL}/journal/create`,
  getAllEntries: `${API_BASE_URL}/journal/all`,
  editEntry: (id) => `${API_BASE_URL}/journal/edit/${id}`,
  deleteEntry: (id) => `${API_BASE_URL}/journal/delete/${id}`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export default API_CONFIG;
