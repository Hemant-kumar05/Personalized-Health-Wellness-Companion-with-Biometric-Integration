import React, { createContext, useContext, useState } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Simple Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    console.log('Login attempt with:', email);
    
    // Simulate login with Promise
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = { id: 1, email, name: 'Test User' };
        setUser(userData);
        setLoading(false);
        console.log('Login successful, user set:', userData);
        resolve(userData);
      }, 1000);
    });
  };

  const register = async (name, email, password) => {
    setLoading(true);
    console.log('Registration attempt with:', name, email);
    
    // Simulate registration with Promise
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = { id: 1, email, name };
        setUser(userData);
        setLoading(false);
        console.log('Registration successful, user set:', userData);
        resolve(userData);
      }, 1000);
    });
  };

  const logout = () => {
    console.log('Logout called');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};