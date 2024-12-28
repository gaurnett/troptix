'use client';

import WebNavigator from '@/components/WebNavigator';
import { MetaHead } from '@/components/utils/MetaHead';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/utils/ErrorFallback';
import { ConfigProvider } from 'antd';
import { withRouter } from 'next/router';
import Head from 'next/head';

function App({ Component, pageProps, router }: AppProps) {
  const queryClient = new QueryClient();

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
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>

          <QueryClientProvider client={queryClient}>
            <WebNavigator
              pageProps={pageProps}
              Component={Component}
              router={router}
            />
          </QueryClientProvider>
        </>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default withRouter(App);
