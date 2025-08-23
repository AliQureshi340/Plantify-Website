// contexts/AdminAuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create Admin Auth Context
const AdminAuthContext = createContext();

// Initial State
const initialState = {
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  permissions: {}
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
        admin: action.payload,
        permissions: action.payload.permissions || {},
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        admin: null,
        permissions: {},
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        admin: null,
        permissions: {},
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'UPDATE_ADMIN':
      return {
        ...state,
        admin: { ...state.admin, ...action.payload },
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

// Admin Auth Provider Component
export const AdminAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configure axios defaults for admin
  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    axios.defaults.withCredentials = true;
    
    // Add response interceptor for admin token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && state.isAuthenticated) {
          dispatch({ type: 'LOGOUT' });
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }, [state.isAuthenticated]);

  // Check if admin is logged in on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await axios.get('/admin/me');
      
      if (response.data.status === 'success') {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: response.data.data.admin 
        });
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Admin login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOADING' });
      
      const response = await axios.post('/admin/login', credentials);

      if (response.data.status === 'success') {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: response.data.data.admin 
        });
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Admin logout function
  const logout = async () => {
    try {
      await axios.get('/admin/logout');
      dispatch({ type: 'LOGOUT' });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      return { success: true }; // Still logout on frontend
    }
  };

  // Update admin profile
  const updateProfile = async (adminData) => {
    try {
      const response = await axios.patch('/admin/update-me', adminData);
      
      if (response.data.status === 'success') {
        dispatch({ 
          type: 'UPDATE_ADMIN', 
          payload: response.data.data.admin 
        });
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Change admin password
  const changePassword = async (passwordData) => {
    try {
      const response = await axios.patch('/admin/update-password', passwordData);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Password updated successfully' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      return { success: false, error: message };
    }
  };

  // Forgot password function
  const forgotPassword = async (credentials) => {
    try {
      const response = await axios.post('/admin/forgot-password', credentials);
      
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
      const response = await axios.patch(`/admin/reset-password/${token}`, passwordData);
      
      if (response.data.status === 'success') {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: response.data.data.admin 
        });
        return { success: true, message: 'Password reset successfully' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Create new admin (Super Admin only)
  const createAdmin = async (adminData) => {
    try {
      const response = await axios.post('/admin/create-admin', adminData);
      
      if (response.data.status === 'success') {
        return { success: true, message: response.data.message, data: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create admin';
      return { success: false, error: message };
    }
  };

  // Get admin activity log
  const getActivityLog = async () => {
    try {
      const response = await axios.get('/admin/activity-log');
      
      if (response.data.status === 'success') {
        return { success: true, data: response.data.data.activities };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch activity log';
      return { success: false, error: message };
    }
  };

  // Get active sessions
  const getActiveSessions = async () => {
    try {
      const response = await axios.get('/admin/active-sessions');
      
      if (response.data.status === 'success') {
        return { success: true, data: response.data.data.sessions };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch sessions';
      return { success: false, error: message };
    }
  };

  // Terminate session
  const terminateSession = async (sessionId) => {
    try {
      const response = await axios.delete(`/admin/sessions/${sessionId}`);
      
      if (response.data.status === 'success') {
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to terminate session';
      return { success: false, error: message };
    }
  };

  // Enable 2FA
  const enableTwoFactor = async () => {
    try {
      const response = await axios.patch('/admin/enable-2fa');
      
      if (response.data.status === 'success') {
        dispatch({ 
          type: 'UPDATE_ADMIN', 
          payload: { twoFactorEnabled: true } 
        });
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to enable 2FA';
      return { success: false, error: message };
    }
  };

  // Disable 2FA
  const disableTwoFactor = async () => {
    try {
      const response = await axios.patch('/admin/disable-2fa');
      
      if (response.data.status === 'success') {
        dispatch({ 
          type: 'UPDATE_ADMIN', 
          payload: { twoFactorEnabled: false } 
        });
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to disable 2FA';
      return { success: false, error: message };
    }
  };

  // Check permissions
  const hasPermission = (resource, action) => {
    if (!state.admin) return false;
    if (state.admin.role === 'super-admin') return true;
    
    return state.permissions[resource]?.[action] || false;
  };

  // Check role
  const hasRole = (role) => {
    return state.admin?.role === role;
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    createAdmin,
    getActivityLog,
    getActiveSessions,
    terminateSession,
    enableTwoFactor,
    disableTwoFactor,
    hasPermission,
    hasRole,
    clearError,
    checkAuthStatus
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  
  return context;
};

// Higher-order component for protected admin routes
export const withAdminAuth = (Component, requiredPermissions = []) => {
  return function AuthenticatedAdminComponent(props) {
    const { isAuthenticated, isLoading, hasPermission, admin } = useAdminAuth();
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      window.location.href = '/admin/login';
      return null;
    }

    // Check permissions if required
    if (requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.some(permission => {
        const [resource, action] = permission.split(':');
        return hasPermission(resource, action);
      });

      if (!hasRequiredPermission && admin?.role !== 'super-admin') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        );
      }
    }
    
    return <Component {...props} />;
  };
};