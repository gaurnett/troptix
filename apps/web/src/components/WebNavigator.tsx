"use client";

import { Inter } from 'next/font/google'
import type { AppProps } from "next/app";
import { usePathname, useSearchParams } from "next/navigation";
import Header from "./ui/header";
import AdminHeader from './ui/admin-header';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { auth } from '../config';
import { getUsers, GetUsersType } from 'troptix-api';
import { User, setUserFromResponse } from 'troptix-models';
import Navbar from './navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const TropTixContext = createContext({
  user: new User(),
  setUser: (user: any) => { }
});
export const useTropTixContext = () => useContext(TropTixContext);

export default function WebNavigator({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        let currentUser = setUserFromResponse(null, user);
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <TropTixContext.Provider
      value={
        (user === undefined || user === null) ?
          {
            user: undefined,
            setUser: (user: any) => { }
          } :
          {
            user: user,
            setUser: setUser
          }}>
      {
        loading ? <></> :
          <div className="mx-auto ">
            <div className={`${inter.variable} font-inter antialiased bg-white text-gray-900 tracking-tight`}>
              <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
                {
                  !pathname.includes("admin") ?
                    <div>
                      <Header />
                      <div className="min-h-screen flex-grow border-x">
                        <Component {...pageProps} />
                      </div>
                    </div> :
                    <div>
                      <AdminHeader />
                      <div className="min-h-screen flex-grow mt-32">
                        <Component {...pageProps} />
                      </div>
                    </div>
                }
              </div>
            </div>
          </div>
      }

    </TropTixContext.Provider>

  );
}
