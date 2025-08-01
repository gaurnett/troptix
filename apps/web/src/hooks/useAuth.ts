'use client';

import { useContext } from 'react';
import { TropTixContext } from '@/components/AuthProvider';

/**
 * Returns user, loading, isAuthenticated, userId, userEmail, and isOrganizer
 */
export function useAuth() {
  const context = useContext(TropTixContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    user: context.user,
    loading: context.loading,
    isAuthenticated: !!context.user?.id,
    userId: context.user?.id,
    userEmail: context.user?.email,
    isOrganizer: context.user?.isOrganizer,
  };
}

/**
 * Returns userId
 */
export function useUserId() {
  const { userId } = useAuth();
  return userId;
}
