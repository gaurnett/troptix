// app/providers.tsx
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';
import { ConfigProvider } from 'antd';

import AuthProvider from '@/components/AuthProvider';
import { ErrorFallback } from '@/components/utils/ErrorFallback';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ConfigProvider
      theme={{
        components: {
          /* Ant Design component tokens */
        },
      }}
    >
      {/* You might place the ErrorBoundary here or within RootLayout */}
      {/* Using router.push('/') might not be ideal here if the error happens */}
      {/* during initial load before router is ready. Consider alternatives. */}
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset application state and attempt recovery
          // Maybe reload or navigate home. Push requires client component.
          router.push('/');
        }}
        // key prop might not be needed here as it was tied to page router navigation
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
}
