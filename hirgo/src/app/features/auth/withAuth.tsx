import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { ComponentType, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Higher-order component for route protection
 * Redirects to login page if user is not authenticated
 */
export function withAuth<T extends object>(Component: ComponentType<T>) {
  return function ProtectedRoute(props: T) {
    const { isAuthenticated, isLoading, refreshToken } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      // Try to refresh token if not authenticated
      const attemptRefresh = async () => {
        if (!isAuthenticated && !isLoading) {
          // Try refreshing token first
          const refreshSucceeded = await refreshToken();
          
          // If refresh failed, redirect to login
          if (!refreshSucceeded) {
            router.push('/login');
          }
        }
      };
      
      attemptRefresh();
    }, [isAuthenticated, isLoading, refreshToken, router]);
    
    // Show loading state while checking auth
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      );
    }
    
    // If authenticated, render the protected component
    if (isAuthenticated) {
      return <Component {...props} />;
    }
    
    // Return null during the redirect process
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  };
} 