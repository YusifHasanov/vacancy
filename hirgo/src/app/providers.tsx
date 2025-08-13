'use client';

import { PropsWithChildren, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/app/store';
import Cookies from 'js-cookie';
import { setAuthenticated } from '@/app/features/auth/authSlice';

// Component to initialize auth state
function AuthInitializer({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check if token exists on initial load
    const token = Cookies.get('token');
    if (token) {
      dispatch(setAuthenticated(true));
    }
  }, [dispatch]);
  
  return <>{children}</>;
}

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
} 