'use client'

import WebNavigator from "@/components/WebNavigator";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { withRouter } from "next/router";

function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>TropTix</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <WebNavigator pageProps={pageProps} Component={Component} router={router} />
    </>
  );
}

export default withRouter(App); 