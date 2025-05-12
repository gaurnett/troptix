// app/providers.tsx
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';
import { ConfigProvider } from 'antd';

import AuthProvider from '@/components/AuthProvider';
import { ErrorFallback } from '@/components/utils/ErrorFallback';
import Header from '@/components/ui/header';

const queryClient = new QueryClient();

function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="flex-grow border-x mt-20 md:mt-28">{children}</div>
    </div>
  );
}

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
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          router.push('/');
        }}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <GlobalLayout>{children}</GlobalLayout>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
}
