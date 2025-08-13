'use client';

import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { decodeJwt } from '@/util/jwt';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { setAuthenticated } from '@/app/features/auth/authSlice';
import { useLogoutMutation } from '@/app/features/auth/authSlice';

// Define user role types
export type UserRole = 'ROLE_APPLICANT' | 'ROLE_COMPANY' | null;

// User interface with essential information
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isApplicant: boolean;
  isCompany: boolean;
}

export function useUser() {
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    role: null,
    isApplicant: false,
    isCompany: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Get the logout mutation from the auth API
  const [logoutMutation] = useLogoutMutation();
  
  // Subscribe to auth state changes from Redux
  const authStateChanged = useSelector((state: RootState) => state.auth.authStateChanged);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Load user data from the JWT token
  const loadUser = useCallback(() => {
    setIsLoading(true);
    
    // Get token from cookies
    const token = Cookies.get('token');
    
    if (!token) {
      setUser({
        id: '',
        email: '',
        role: null,
        isApplicant: false,
        isCompany: false
      });
      dispatch(setAuthenticated(false));
      setIsLoading(false);
      return;
    }

    // Decode token to get user information
    const payload = decodeJwt(token);
    
    if (!payload) {
      setUser({
        id: '',
        email: '',
        role: null,
        isApplicant: false,
        isCompany: false
      });
      dispatch(setAuthenticated(false));
      setIsLoading(false);
      return;
    }

    // Extract role from payload
    const role = payload.roles as UserRole[];
    const isApplicant = role.includes('ROLE_APPLICANT');
    const isCompany = role.includes('ROLE_COMPANY');

    setUser({
      id: payload.profileId,
      email: payload.email,
      role: role[0],
      isApplicant,
      isCompany
    });
    
    dispatch(setAuthenticated(true));
    setIsLoading(false);
  }, [dispatch]);

  // Logout function to remove tokens and reset user state
  const logout = useCallback(() => {
    try {
      // Call the logout mutation - the onQueryStarted callback will handle
      // clearing cookies and updating Redux state
      logoutMutation();
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Fallback: manually clear cookies and update state if the API call fails
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      dispatch(setAuthenticated(false));
      router.push('/login');
    }
  }, [router, dispatch, logoutMutation]);

  useEffect(() => {
    loadUser();
  }, [loadUser, authStateChanged]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isApplicant: user.isApplicant,
    isCompany: user.isCompany,
    logout,
    refreshUser: loadUser
  };
} 