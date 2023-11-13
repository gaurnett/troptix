'use client'

import WebNavigator from "@/components/WebNavigator";
import Navbar from "@/components/navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter, withRouter } from "next/router";
import { useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

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