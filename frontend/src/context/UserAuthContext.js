// contexts/UserAuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
const UserAuthContext = createContext();

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Auth Provider Component
export const UserAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    axios.defaults.withCredentials = true;
    
    // Add response interceptor for token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && state.isAuthenticated) {
          dispatch({ type: 'LOGOUT' });
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }, [state.isAuthenticated]);

  // Check if user is logged in on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await axios.get('/users/me');
      
      if (response.data.status === 'success') {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: response.data.data.user 
        });
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOADING' });
      
      const response = await axios.post('/users/login', {
        email,
        password
      });

      if (response.data.status === 'success') {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: response.data.data.user 
        });
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: 'LOADING' });
      
      const response = await axios.post('/users/signup', userData);

      if (response.data.status === 'success') {
        return { 
          success: true, 
          message: response.data.message 
        };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get('/users/logout');
      dispatch({ type: 'LOGOUT' });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      return { success: true }; // Still logout on frontend
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      const response = await axios.patch('/users/update-me', userData);
      
      if (response.data.status === 'success') {
        dispatch({ 
          type: 'UPDATE_USER', 
          payload: response.data.data.user 
        });
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const response = await axios.patch('/users/update-password', passwordData);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Password updated successfully' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      return { success: false, error: message };
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/users/forgot-password', { email });
      
      if (response.data.status === 'success') {
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      return { success: false, error: message };
    }
  };

  // Reset password function
  const resetPassword = async (token, passwordData) => {
    try {
      const response = await axios.patch(`/users/reset-password/${token}`, passwordData);
      
      if (response.data.status === 'success') {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: response.data.data.user 
        });
        return { success: true, message: 'Password reset successfully' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Add plant to collection
  const addPlantToCollection = async (plantData) => {
    try {
      const response = await axios.post('/users/add-plant', plantData);
      
      if (response.data.status === 'success') {
        // Update user data with new plant collection
        await checkAuthStatus();
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add plant';
      return { success: false, error: message };
    }
  };

  // Record plant identification
  const recordIdentification = async (identificationData) => {
    try {
      const response = await axios.post('/users/record-identification', identificationData);
      
      if (response.data.status === 'success') {
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to record identification';
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    addPlantToCollection,
    recordIdentification,
    clearError,
    checkAuthStatus
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  
  return context;
};

// Higher-order component for protected routes
export const withUserAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useUserAuth();
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    
    return <Component {...props} />;
  };
};