import { createContext, useContext, useState, useEffect } from 'react';
import { register as apiRegister, login as apiLogin, logout as apiLogout, getUserProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin({ email, password });
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Split name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await apiRegister({
        username: email.split('@')[0], // Use email prefix as username
        email: email,
        password: password,
        password2: password,
        first_name: firstName,
        last_name: lastName
      });
      
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.username?.[0] || 
                          error.response?.data?.email?.[0] ||
                          error.response?.data?.password?.[0] ||
                          'Registration failed. Please try again.';
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
