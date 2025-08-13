import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { setAuthenticated } from './authSlice';
import { useLogoutMutation, useRefreshTokenMutation } from './authSlice';
import Cookies from 'js-cookie';

/**
 * Custom hook for managing authentication state
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [refreshToken] = useRefreshTokenMutation();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get auth state from Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  
  // Function to check auth status based on tokens
  const checkAuthStatus = useCallback(() => {
    const token = Cookies.get('token');
    
    if (token) {
      dispatch(setAuthenticated(true));
      return true;
    } else {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        dispatch(setAuthenticated(false));
      }
      return false;
    }
  }, [dispatch]);
  
  // Check for token on mount and update auth state
  useEffect(() => {
    checkAuthStatus();
    setIsLoading(false);
    
    // Setup a listener for cookie changes
    const cookieCheckInterval = setInterval(() => {
      checkAuthStatus();
    }, 5000); // Check every 5 seconds
    
    return () => {
      clearInterval(cookieCheckInterval);
    };
  }, [checkAuthStatus]);
  
  // Function to manually refresh the token
  const handleRefreshToken = async () => {
    try {
      const result = await refreshToken().unwrap();
      if (result.status.code === 'SUCCESS') {
        dispatch(setAuthenticated(true));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };
  
  // Function to log the user out
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Even if the API call fails, clear cookies and update state
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      dispatch(setAuthenticated(false));
      
      return false;
    }
  };
  
  return {
    isAuthenticated,
    isLoading,
    refreshToken: handleRefreshToken,
    logout: handleLogout,
    checkAuthStatus
  };
}; 