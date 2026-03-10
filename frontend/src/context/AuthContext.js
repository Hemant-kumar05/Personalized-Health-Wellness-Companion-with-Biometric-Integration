import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('healthToken'),
  loading: true,
  error: null,
};

// Action types
const actionTypes = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAIL: 'AUTH_FAIL',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

const normalizeUser = (user) => {
  if (!user) return user;

  const fullName = user.fullName || user.name || '';
  const parts = fullName.split(' ').filter(Boolean);
  const derivedFirstName = parts[0];
  const derivedLastName = parts.slice(1).join(' ');

  return {
    ...user,
    fullName: user.fullName || fullName,
    name: user.name || fullName,
    firstName: user.firstName || derivedFirstName,
    lastName: user.lastName || derivedLastName,
  };
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('healthToken');
      if (token) {
        try {
          dispatch({ type: actionTypes.AUTH_START });
          const response = await authService.getCurrentUser();
          dispatch({
            type: actionTypes.AUTH_SUCCESS,
            payload: {
              user: normalizeUser(response.data.user),
              token,
            },
          });
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('healthToken');
          dispatch({
            type: actionTypes.AUTH_FAIL,
            payload: 'Session expired. Please login again.',
          });
        }
      } else {
        dispatch({ type: actionTypes.AUTH_FAIL, payload: null });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: actionTypes.AUTH_START });
      const response = await authService.login(email, password);
      
      const { user, token } = response.data;
      const normalizedUser = normalizeUser(user);
      
      // Store token in localStorage
      localStorage.setItem('healthToken', token);
      
      dispatch({
        type: actionTypes.AUTH_SUCCESS,
        payload: { user: normalizedUser, token },
      });

      toast.success(`Welcome back, ${normalizedUser.firstName || normalizedUser.fullName || 'there'}!`);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: actionTypes.AUTH_FAIL,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: actionTypes.AUTH_START });
      const response = await authService.register(userData);
      
      const { user, token } = response.data;
      const normalizedUser = normalizeUser(user);
      
      // Store token in localStorage
      localStorage.setItem('healthToken', token);
      
      dispatch({
        type: actionTypes.AUTH_SUCCESS,
        payload: { user: normalizedUser, token },
      });

      toast.success(`Welcome to Health Companion, ${normalizedUser.firstName || normalizedUser.fullName || 'there'}!`);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: actionTypes.AUTH_FAIL,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('healthToken');
    dispatch({ type: actionTypes.LOGOUT });
    toast.success('Logged out successfully');
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({
      type: actionTypes.UPDATE_USER,
      payload: userData,
    });
  };

  // Update password function
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await authService.updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!state.token && !!state.user;
  };

  // Get user role
  const getUserRole = () => {
    return state.user?.role || 'user';
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    const userRole = getUserRole();
    
    // Define role permissions
    const permissions = {
      admin: ['all'],
      expert: ['view_all_users', 'manage_consultations'],
      user: ['view_own_data', 'manage_own_profile'],
    };

    return permissions[userRole]?.includes(permission) || permissions[userRole]?.includes('all');
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateUser,
    updatePassword,
    clearError,
    isAuthenticated,
    getUserRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;