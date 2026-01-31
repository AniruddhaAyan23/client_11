import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

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
  const [token, setToken] = useState(localStorage.getItem('token'));

  const API_URL = import.meta.env.VITE_API_URL;

  // Register Employee
  const registerEmployee = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/register-employee`, userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  // Register HR
  const registerHR = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/register-hr`, userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  // Login
  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    
    // Sign in to Firebase (for persistence)
    await signInWithEmailAndPassword(auth, email, password);
    
    return response.data;
  };

  // Google Login
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    await signOut(auth);
  };

  // Get current user from backend
  const getCurrentUser = async () => {
    if (!token) return null;
    
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    const response = await axios.put(`${API_URL}/api/auth/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(response.data.user);
    return response.data;
  };

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && token) {
        await getCurrentUser();
      }
      setLoading(false);
    });

    if (token && !user) {
      getCurrentUser();
    } else {
      setLoading(false);
    }

    return unsubscribe;
  }, [token]);

  const value = {
    user,
    loading,
    token,
    registerEmployee,
    registerHR,
    login,
    googleLogin,
    logout,
    getCurrentUser,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};