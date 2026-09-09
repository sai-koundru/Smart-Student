import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.data.user || jwtDecode(token);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
    };
    checkAuth();
  }, [token]);

  const login = async (emailOrUser, passwordOrToken) => {
    // Support login(user, token) from direct responses
    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      const u = emailOrUser;
      const t = passwordOrToken;
      if (t) localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      if (t) setToken(t);
      setUser(u);
      return u;
    }

    // Support login(email, password)
    const res = await api.post('/auth/login', { email: emailOrUser, password: passwordOrToken });
    const { token: t, user: u } = res.data;
    const resolvedUser = u || jwtDecode(t);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(resolvedUser));
    setToken(t);
    setUser(resolvedUser);
    return resolvedUser;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token: t, user: u } = res.data;
    const resolvedUser = u || jwtDecode(t);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(resolvedUser));
    setToken(t);
    setUser(resolvedUser);
    return resolvedUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
