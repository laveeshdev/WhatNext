import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Import the configured axios instance

export const AuthContext = createContext();

const API_URL = '/auth'; // Base URL is now handled by axiosInstance

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(user)

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('localStorage user:', storedUser);
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('AuthContext user state set:', parsedUser);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    } else {
      console.log('No valid user found in localStorage');
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`${API_URL}/register`, userData); // Use axiosInstance
      // backend returns the user object directly
      const createdUser = response.data;
      setUser(createdUser);
      localStorage.setItem('user', JSON.stringify(createdUser));
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const login = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`${API_URL}/login`, userData); // Use axiosInstance
      // backend returns the user object directly
      const loggedInUser = response.data;
      console.log('Login response user:', loggedInUser);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      console.log('User set in state:', loggedInUser);
      console.log('User set in localStorage:', localStorage.getItem('user'));
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
