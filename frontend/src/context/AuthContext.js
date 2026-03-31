import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  isAuthenticated: false,
};

// Action types
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const SET_LOADING = 'SET_LOADING';
const UPDATE_USER = 'UPDATE_USER';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

// Set up axios defaults
const setupAxios = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios with token
  useEffect(() => {
    if (state.token) {
      setupAxios(state.token);
      localStorage.setItem('token', state.token);
    } else {
      setupAxios(null);
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axios.get('/api/auth/me');
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: res.data.user,
              token: state.token,
            },
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          dispatch({ type: AUTH_FAILURE });
        }
      } else {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const res = await axios.post('/api/auth/login', { email, password });
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });

      return { success: true, data: res.data };
    } catch (error) {
      dispatch({ type: AUTH_FAILURE });
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const res = await axios.post('/api/auth/register', userData);
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });

      return { success: true, data: res.data };
    } catch (error) {
      dispatch({ type: AUTH_FAILURE });
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const res = await axios.put('/api/auth/profile', userData);
      dispatch({
        type: UPDATE_USER,
        payload: res.data.user,
      });
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
