'use client';

import React, { ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';

// Component for conditional rendering based on user role
export function RoleBasedContent({
  applicantContent,
  companyContent,
  bothContent,
  unauthenticatedContent,
  loadingContent,
}: {
  applicantContent?: ReactNode;
  companyContent?: ReactNode;
  bothContent?: ReactNode;
  unauthenticatedContent?: ReactNode;
  loadingContent?: ReactNode;
}) {
  const {  isLoading, isApplicant, isCompany, isAuthenticated } = useUser();

  if (isLoading) {
    return loadingContent || <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return unauthenticatedContent || null;
  }

  if (isApplicant) {
    return (
      <>
        {bothContent}
        {applicantContent}
      </>
    );
  }

  if (isCompany) {
    return (
      <>
        {bothContent}
        {companyContent}
      </>
    );
  }

  return null;
}

// HOC for protecting routes based on user role
export function withRoleProtection(
  Component: React.ComponentType<never>,
  options: {
    allowApplicant?: boolean;
    allowCompany?: boolean;
    redirectPath?: string;
  } = {}
) {
  const { allowApplicant = true, allowCompany = true, redirectPath = '/login' } = options;

  return function ProtectedComponent(props: never) {
    const { isLoading, isApplicant, isCompany, isAuthenticated } = useUser();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      // In client components, we need to handle redirects programmatically
      if (typeof window !== 'undefined') {
        window.location.href = redirectPath;
      }
      return null;
    }

    const hasAccess =
      (isApplicant && allowApplicant) ||
      (isCompany && allowCompany);

    if (!hasAccess) {
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
      return null;
    }

    // @ts-expect-error
    return <Component {...props}  />;
  };
}

// Example usage for quick role checks
export function useRoleCheck() {
  const { isApplicant, isCompany, isAuthenticated, isLoading } = useUser();

  return {
    isApplicant,
    isCompany,
    isAuthenticated,
    isLoading,
    canPostJobs: isCompany,
    canApplyToJobs: isApplicant,
  };
}
