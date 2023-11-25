"use client";

import WebNavigator from "@/components/WebNavigator";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { withRouter } from "next/router";

function App({ Component, pageProps, router }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <title>TropTix</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <WebNavigator
          pageProps={pageProps}
          Component={Component}
          router={router}
        />
      </QueryClientProvider>
    </>
  );
}

export default withRouter(App);
