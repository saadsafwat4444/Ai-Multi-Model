// Helper function to get token from sessionStorage (more reliable than localStorage)
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

// Helper function to set token in sessionStorage
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('token', token);
  }
};

// Helper function to remove token from sessionStorage
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('token');
  }
};

// Helper function to create auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } : {
    'Content-Type': 'application/json',
  };
};
