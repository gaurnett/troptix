"use client";

import { TROPTIX_ORGANIZER_ALLOW_LIST } from '@/firebase/remoteConfig';
import { User, initializeUser } from '@/hooks/types/User';
import { LoadingOutlined } from '@ant-design/icons';
import { Analytics } from '@vercel/analytics/react';
import { Spin } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { fetchAndActivate, getRemoteConfig, getValue } from "firebase/remote-config";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { app, auth } from "../config";
import AdminHeader from "./ui/admin-header";
import Header from "./ui/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const user: User = {
  id: '',
  jwtToken: ''
}

export const TropTixContext = createContext({
  user: user,
});

export const useTropTixContext = () => useContext(TropTixContext);

export default function WebNavigator({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (
      (pathname.includes("admin") || pathname.includes("account")) &&
      !loading &&
      !user
    ) {
      router.push("/auth/signup");
    }

    if (
      (pathname.includes("admin")) &&
      !loading &&
      user && !user.isOrganizer
    ) {
      router.push("/");
    }
  }, [loading, pathname, router, user]);

  useEffect(() => {
    async function isUserAnOrganizer(userId: string) {
      let isOrganizer = false;

      if (typeof window !== 'undefined') {
        const remoteConfig = getRemoteConfig(app);
        remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

        isOrganizer = await fetchAndActivate(remoteConfig)
          .then(() => {
            const organizerList = getValue(remoteConfig, TROPTIX_ORGANIZER_ALLOW_LIST);
            const organizers = Array.from(JSON.parse(organizerList.asString()));
            if (organizers.includes(userId)) {
              return true;
            }

            return false;
          })
          .catch((err) => {
            return false;
          });
      }

      return isOrganizer;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let currentUser = await initializeUser(user);
        currentUser.isOrganizer = await isUserAnOrganizer(currentUser.id as string);
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(undefined);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading && pathname !== '/' && pathname !== '/home') {
    return (<></>);
  }

  return (
    <TropTixContext.Provider value={{
      user: user as User,
    }}
    >
      {loading && (pathname === '/' || pathname === '/home') ? (
        <>
          <Spin className="flex h-screen items-center justify-center" indicator={<LoadingOutlined style={{ fontSize: 84 }} spin />} />
        </>
      ) : (
        <div className="mx-auto ">
          <div
            className={`${inter.variable} font-inter antialiased bg-white text-gray-900 tracking-tight`}
          >
            <div className="flex flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
              <Analytics />
              {!pathname.includes("admin") ?
                <div>
                  <Header />
                  <div className="flex-grow border-x">
                    <Component {...pageProps} />
                  </div>
                </div>
                :
                <div>
                  {user === null ?
                    <></>
                    :
                    <>
                      <AdminHeader />
                      <div className="flex-grow mt-32">
                        <Component {...pageProps} />
                      </div>
                    </>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </TropTixContext.Provider>
  );
}
