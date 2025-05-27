import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/Auth/login', credentials);
  return response.data;
};

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const clearToken = () => localStorage.removeItem('token');

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (err) {
    console.error("Error decoding token", err);
    return null;
  }
};
