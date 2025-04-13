// contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMe } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        try {
          const userData = await getMe();

          setUser(userData.data);
        } catch (error) {
          console.error(
            'UserContext useEffect: Error fetching user from token:',
            error
          );
          localStorage.removeItem('authToken');
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token); // หรือ sessionStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken'); // หรือ sessionStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
