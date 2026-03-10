import React, { createContext, useContext, useReducer, useCallback } from 'react';
import biometricService from '../services/biometricService';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  biometricData: {},
  summary: null,
  trends: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BIOMETRIC_DATA: 'SET_BIOMETRIC_DATA',
  SET_SUMMARY: 'SET_SUMMARY',
  SET_TRENDS: 'SET_TRENDS',
  ADD_BIOMETRIC_ENTRY: 'ADD_BIOMETRIC_ENTRY',
  UPDATE_BIOMETRIC_ENTRY: 'UPDATE_BIOMETRIC_ENTRY',
  DELETE_BIOMETRIC_ENTRY: 'DELETE_BIOMETRIC_ENTRY',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const healthDataReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case actionTypes.SET_BIOMETRIC_DATA:
      return {
        ...state,
        biometricData: {
          ...state.biometricData,
          [action.payload.type]: action.payload.data,
        },
        lastUpdated: new Date(),
        loading: false,
        error: null,
      };
    case actionTypes.SET_SUMMARY:
      return {
        ...state,
        summary: action.payload,
        lastUpdated: new Date(),
        loading: false,
        error: null,
      };
    case actionTypes.SET_TRENDS:
      return {
        ...state,
        trends: {
          ...state.trends,
          [action.payload.type]: action.payload.data,
        },
        lastUpdated: new Date(),
        loading: false,
        error: null,
      };
    case actionTypes.ADD_BIOMETRIC_ENTRY:
      const currentData = state.biometricData[action.payload.type] || [];
      return {
        ...state,
        biometricData: {
          ...state.biometricData,
          [action.payload.type]: [action.payload.entry, ...currentData],
        },
        lastUpdated: new Date(),
      };
    case actionTypes.UPDATE_BIOMETRIC_ENTRY:
      const updatedData = state.biometricData[action.payload.type]?.map(entry =>
        entry._id === action.payload.entry._id ? action.payload.entry : entry
      ) || [];
      return {
        ...state,
        biometricData: {
          ...state.biometricData,
          [action.payload.type]: updatedData,
        },
        lastUpdated: new Date(),
      };
    case actionTypes.DELETE_BIOMETRIC_ENTRY:
      const filteredData = state.biometricData[action.payload.type]?.filter(entry =>
        entry._id !== action.payload.entryId
      ) || [];
      return {
        ...state,
        biometricData: {
          ...state.biometricData,
          [action.payload.type]: filteredData,
        },
        lastUpdated: new Date(),
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const HealthDataContext = createContext();

// Health Data Provider Component
export const HealthDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(healthDataReducer, initialState);

  // Fetch biometric data by type
  const fetchBiometricData = useCallback(async (type, options = {}) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await biometricService.getBiometricData(type, options);

      const biometricRows = Array.isArray(response.data)
        ? response.data
        : (response.data?.biometricData || []);
      
      dispatch({
        type: actionTypes.SET_BIOMETRIC_DATA,
        payload: {
          type,
          data: biometricRows,
        },
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to fetch ${type} data`;
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Fetch biometric summary
  const fetchBiometricSummary = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await biometricService.getBiometricSummary();
      
      dispatch({
        type: actionTypes.SET_SUMMARY,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch summary';
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Fetch biometric trends
  const fetchBiometricTrends = useCallback(async (type, period = 'month') => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await biometricService.getBiometricTrends(type, period);
      
      dispatch({
        type: actionTypes.SET_TRENDS,
        payload: {
          type,
          data: response.data,
        },
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to fetch ${type} trends`;
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Log new biometric data
  const logBiometricData = useCallback(async (biometricData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await biometricService.logBiometricData(biometricData);

      const createdEntry = response.data?.biometricData || response.data;
      
      dispatch({
        type: actionTypes.ADD_BIOMETRIC_ENTRY,
        payload: {
          type: biometricData.type,
          entry: createdEntry,
        },
      });

      toast.success(`${biometricData.type.replace('_', ' ')} logged successfully!`);
      
      // Refresh summary after logging new data
      fetchBiometricSummary();

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to log biometric data';
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      throw error;
    }
  }, [fetchBiometricSummary]);

  // Update biometric data entry
  const updateBiometricData = useCallback(async (entryId, updateData) => {
    try {
      const response = await biometricService.updateBiometricData(entryId, updateData);
      
      dispatch({
        type: actionTypes.UPDATE_BIOMETRIC_ENTRY,
        payload: {
          type: response.data.biometricData.type,
          entry: response.data.biometricData,
        },
      });

      toast.success('Data updated successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update data';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Delete biometric data entry
  const deleteBiometricData = useCallback(async (entryId, type) => {
    try {
      await biometricService.deleteBiometricData(entryId);
      
      dispatch({
        type: actionTypes.DELETE_BIOMETRIC_ENTRY,
        payload: {
          type,
          entryId,
        },
      });

      toast.success('Data deleted successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete data';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Get latest value for a specific biometric type
  const getLatestValue = useCallback((type) => {
    const data = state.biometricData[type];
    if (!data || data.length === 0) return null;
    
    return data[0]; // Assuming data is sorted by date (newest first)
  }, [state.biometricData]);

  // Get trend direction for a specific type
  const getTrendDirection = useCallback((type) => {
    const trends = state.trends[type];
    if (!trends?.analysis) return 'stable';
    
    return trends.analysis.trendDirection;
  }, [state.trends]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  // Check if data needs refresh (older than 5 minutes)
  const isDataStale = useCallback((minutes = 5) => {
    if (!state.lastUpdated) return true;
    
    const now = new Date();
    const diff = (now - new Date(state.lastUpdated)) / (1000 * 60);
    return diff > minutes;
  }, [state.lastUpdated]);

  const value = {
    // State
    biometricData: state.biometricData,
    summary: state.summary,
    trends: state.trends,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Actions
    fetchBiometricData,
    fetchBiometricSummary,
    fetchBiometricTrends,
    logBiometricData,
    updateBiometricData,
    deleteBiometricData,
    clearError,
    
    // Helpers
    getLatestValue,
    getTrendDirection,
    isDataStale,
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};

// Custom hook to use health data context
export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

export default HealthDataContext;