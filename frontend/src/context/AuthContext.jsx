import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getMe, loginUser, registerUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser(); // Reload user data to get role etc.
      
      // Manually decode to get role for immediate navigation
      const decodedUser = JSON.parse(atob(res.data.token.split('.')[1])).user;
      
      notifications.show({
        title: 'Login Successful',
        message: `Welcome back, ${decodedUser.name}!`,
        color: 'teal',
      });
      
      if (decodedUser.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
       notifications.show({
        title: 'Login Failed',
        message: err.response?.data?.msg || 'An error occurred.',
        color: 'red',
      });
      throw err;
    }
  };

  const signup = async (payload) => {
    try {
      const res = await registerUser(payload);
      localStorage.setItem('token', res.data.token);
      await loadUser();

      const decodedUser = JSON.parse(atob(res.data.token.split('.')[1])).user;

      notifications.show({
        title: 'Account created',
        message: `Welcome, ${decodedUser.name}!`,
        color: 'teal',
      });

      if (decodedUser.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      notifications.show({
        title: 'Signup Failed',
        message: err.response?.data?.msg || 'An error occurred.',
        color: 'red',
      });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};