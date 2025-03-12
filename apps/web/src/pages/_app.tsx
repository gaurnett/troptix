'use client';
import { VercelToolbar } from '@vercel/toolbar/next';
import WebNavigator from '@/components/WebNavigator';
import { MetaHead } from '@/components/utils/MetaHead';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/utils/ErrorFallback';
import { ConfigProvider } from 'antd';
import { withRouter } from 'next/router';

function App({ Component, pageProps, router }: AppProps) {
  const queryClient = new QueryClient();
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';

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
            <WebNavigator
              pageProps={pageProps}
              Component={Component}
              router={router}
            />
            {shouldInjectToolbar && <VercelToolbar />}
          </QueryClientProvider>
        </>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default withRouter(App);
