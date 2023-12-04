"use client";

import WebNavigator from "@/components/WebNavigator";
import { ErrorBoundary } from "react-error-boundary";
import { MetaHead } from "@/components/utils/MetaHead";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

import { withRouter } from "next/router";
import { ErrorFallback } from "@/components/utils/ErrorFallback";

function App({ Component, pageProps, router }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary
      key={router.asPath}
      FallbackComponent={ErrorFallback}
      onReset={() => {
        router.push("/");
      }}
    >
      <>
        <MetaHead
          title="Troptix"
          description={"Troptix is a better way to get tickets"}
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
        </QueryClientProvider>
      </>
    </ErrorBoundary>
  );
}

export default withRouter(App);
