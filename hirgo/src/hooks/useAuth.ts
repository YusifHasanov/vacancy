'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in cookies
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {    
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return { isAuthenticated, logout };
}; 