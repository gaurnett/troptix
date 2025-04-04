'use client';

import { TROPTIX_ORGANIZER_ALLOW_LIST } from '@/firebase/remoteConfig';
import { User, initializeUser } from '@/hooks/types/User';
import { cn } from '@/lib/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from 'firebase/remote-config';
import { Inter } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { app, auth } from '../config';

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
  loading: true,
});

export const useTropTixContext = () => useContext(TropTixContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

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
        loading,
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
              {children}
            </div>
          </div>
        </div>
      )}
    </TropTixContext.Provider>
  );
}
