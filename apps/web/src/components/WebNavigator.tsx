'use client';

import { TROPTIX_ORGANIZER_ALLOW_LIST } from '@/firebase/remoteConfig';
import { User, initializeUser } from '@/hooks/types/User';
import { cn } from '@/lib/utils';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import { LoadingOutlined } from '@ant-design/icons';
import { Analytics } from '@vercel/analytics/react';
import { Spin } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from 'firebase/remote-config';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { app, auth } from '../config';
import Header from './ui/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const emptyUser: User = {
  id: '',
  jwtToken: '',
};

export const TropTixContext = createContext({
  user: emptyUser,
});

export const useTropTixContext = () => useContext(TropTixContext);

export default function WebNavigator({
  Component,
  pageProps,
  router,
}: AppProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  // const router = useRouter();

  useEffect(() => {
    if (
      (pathname.includes('admin') || pathname.includes('account')) &&
      !loading &&
      !user?.id
    ) {
      router.push('/auth/signup');
    }

    if (pathname.includes('admin') && !loading && user && !user.isOrganizer) {
      router.push('/');
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
            const organizerList = getValue(
              remoteConfig,
              TROPTIX_ORGANIZER_ALLOW_LIST
            );
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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let currentUser = await initializeUser(firebaseUser);
        currentUser.isOrganizer = await isUserAnOrganizer(
          currentUser.id as string
        );
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(emptyUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading && pathname !== '/' && pathname !== '/home') {
    return <></>;
  }

  return (
    <TropTixContext.Provider
      value={{
        user: user as User,
      }}
    >
      {loading && (pathname === '/' || pathname === '/home') ? (
        <>
          <Spin
            className="flex h-screen items-center justify-center"
            indicator={<LoadingOutlined style={{ fontSize: 84 }} spin />}
          />
        </>
      ) : (
        <div
          className={cn(
            'min-h-screen font-sans antialiased mx-auto',
            inter.variable
          )}
        >
          <div
            className={`${inter.variable} font-inter antialiased text-gray-900 tracking-tight`}
          >
            <div className="flex flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
              <Analytics />
              {!pathname.includes('admin') ? (
                <div>
                  <Header />
                  <div className="flex-grow border-x">
                    <Component {...pageProps} />
                  </div>
                </div>
              ) : (
                <div>
                  {user && (
                    <AdminDashboard
                      Component={Component}
                      pageProps={pageProps}
                      router={router}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </TropTixContext.Provider>
  );
}
