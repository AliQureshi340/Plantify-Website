import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Mail, Lock, Phone, MapPin, Upload, Eye, EyeOff, X } from 'lucide-react';

// ==================== AUTH CONTEXT ====================

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      };
    case 'LOAD_USER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
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

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null
  });

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({
          type: 'LOAD_USER',
          payload: { token, user: parsedUser }
        });
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Invalid stored data' });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // API call helper with auth
  const authFetch = async (url, options = {}) => {
    const token = state.token || localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const response = await fetch(`http://localhost:5000${url}`, config);
    
    if (response.status === 401) {
      dispatch({ type: 'LOGOUT' });
      throw new Error('Session expired. Please login again.');
    }

    return response;
  };

  // Auth functions
  const login = async (email, password, userType) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, expectedRole: userType })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Verify user type matches
      if (data.user.role !== userType) {
        throw new Error(`This account is registered as ${data.user.role}, not ${userType}`);
      }

      dispatch({
        type: 'LOGIN',
        payload: { token: data.token, user: data.user }
      });

      return { success: true, user: data.user };
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      dispatch({
        type: 'LOGIN',
        payload: { token: data.token, user: data.user }
      });

      return { success: true, user: data.user };
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const response = await authFetch('/api/auth/profile', {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Profile update failed');
      }

      dispatch({
        type: 'LOAD_USER',
        payload: { token: state.token, user: data }
      });

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    authFetch,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ==================== LOGIN/REGISTER MODAL ====================

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', userType = 'user' }) => {
  const [mode, setMode] = React.useState(initialMode);
  const [showPassword, setShowPassword] = React.useState(false);
  const [currentUserType, setCurrentUserType] = React.useState(userType);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    role: userType,
    profileImage: null
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const { login, register } = useAuth();

  // Update form data when userType changes
  React.useEffect(() => {
    setCurrentUserType(userType);
    setFormData(prev => ({ ...prev, role: userType }));
  }, [userType]);

  // Reset form when modal opens/closes or mode changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        role: currentUserType,
        profileImage: null
      });
      setError('');
    }
  }, [isOpen, mode, currentUserType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password, currentUserType);
        if (result.success) {
          onClose();
          // Redirect based on role
          if (result.user.role === 'nursery') {
            window.location.href = '/nursery';
          } else {
            window.location.href = '/user';
          }
        } else {
          setError(result.error);
        }
      } else {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const result = await register(formData);
        if (result.success) {
          onClose();
          // Redirect based on role
          if (result.user.role === 'nursery') {
            window.location.href = '/nursery';
          } else {
            window.location.href = '/user';
          }
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: mode === 'register' ? '600px' : '400px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              {currentUserType === 'nursery' ? 'Nursery Owner Portal' : 'Plant Enthusiast Portal'}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
          >
            <X />
          </button>
        </div>

        {/* User Type Indicator */}
        <div style={{
          backgroundColor: currentUserType === 'nursery' ? '#ecfdf5' : '#f0f9ff',
          padding: '10px 15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          border: `2px solid ${currentUserType === 'nursery' ? '#059669' : '#0ea5e9'}`
        }}>
          <strong>
            {currentUserType === 'nursery' ? 'Nursery Owner Registration/Login' : 'Plant Enthusiast Registration/Login'}
          </strong>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              {/* Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  {currentUserType === 'nursery' ? 'Nursery Name *' : 'Full Name *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 45px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder={currentUserType === 'nursery' ? 'Enter nursery name' : 'Enter your full name'}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 45px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder="03001234567"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    {currentUserType === 'nursery' ? 'Nursery Address' : 'Address'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} size={18} />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 45px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      placeholder={currentUserType === 'nursery' ? 'Nursery location' : 'Your address'}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  {currentUserType === 'nursery' ? 'Nursery Logo (Optional)' : 'Profile Picture (Optional)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Upload style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={18} />
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 45px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: mode === 'register' ? '20px' : '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 45px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 45px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  placeholder="Confirm password"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#ccc' : (currentUserType === 'nursery' ? '#059669' : '#28a745'),
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>

          {/* Switch Mode */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#666' }}>
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  phone: '',
                  address: '',
                  city: '',
                  postalCode: '',
                  role: currentUserType,
                  profileImage: null
                });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: currentUserType === 'nursery' ? '#059669' : '#28a745',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline'
              }}
            >
              {mode === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== PROTECTED ROUTE COMPONENT ====================

export const ProtectedRoute = ({ children, requiredRole = null, fallback = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
      }}>
        <h2>Access Denied</h2>
        <p>Please login to access this page</p>
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
      }}>
        <h2>Unauthorized</h2>
        <p>You don't have permission to access this page</p>
      </div>
    );
  }

  return children;
};

// ==================== USER PROFILE COMPONENT ====================

export const UserProfile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    profileImage: null
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateProfile(formData);
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setMessage(result.error);
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0 }}>My Profile</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: '8px 16px',
                backgroundColor: isEditing ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '6px',
            backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
            color: message.includes('success') ? '#155724' : '#721c24',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  {user.role === 'nursery' ? 'Nursery Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Postal Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <strong>{user.role === 'nursery' ? 'Nursery Name:' : 'Name:'}</strong> {user.name}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Phone:</strong> {user.phone || 'Not provided'}
              </div>
              <div>
                <strong>Role:</strong> {user.role}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Address:</strong> {user.address || 'Not provided'}
              </div>
              <div>
                <strong>City:</strong> {user.city || 'Not provided'}
              </div>
              <div>
                <strong>Postal Code:</strong> {user.postalCode || 'Not provided'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;