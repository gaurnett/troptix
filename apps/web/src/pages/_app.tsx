'use client';
import { VercelToolbar } from '@vercel/toolbar/next';
import AuthProvider from '@/components/AuthProvider';
import { MetaHead } from '@/components/utils/MetaHead';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/utils/ErrorFallback';
import { ConfigProvider } from 'antd';
import { withRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout';
import Header from '@/components/ui/header';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import Toaster from '@/components/toaster';
function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="flex-grow border-x">{children}</div>
    </div>
  );
}

function App({ Component, pageProps, router }: AppProps) {
  const queryClient = new QueryClient();
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
  const pathname = usePathname();

  const Layout = pathname?.startsWith('/admin') ? AdminLayout : GlobalLayout;
  return (
    <ConfigProvider
      theme={{
        components: {
          /* here is your component tokens */
        },
      }}
    >
      <ErrorBoundary
        key={router.asPath}
        FallbackComponent={ErrorFallback}
        onReset={() => {
          router.push('/');
        }}
      >
        <>
          <MetaHead
            title="Troptix"
            description={'Troptix is a better way to get tickets'}
          >
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </MetaHead>

          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Layout>
                <Analytics />
                <Toaster />
                <Component {...pageProps} />
              </Layout>
            </AuthProvider>
            {shouldInjectToolbar && <VercelToolbar />}
          </QueryClientProvider>
        </>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default withRouter(App);
