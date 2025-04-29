'use client';

import { User, initializeUser } from '@/hooks/types/User';
import { cn } from '@/lib/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { onIdTokenChanged } from 'firebase/auth';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config';
import Cookies from 'js-cookie';
import { useOrganizerStatus } from '@/hooks/useUser';

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

const useTropTixContext = () => useContext(TropTixContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  // Fetch the organizer state from the database
  const { data: isOrganizer, isLoading: isOrganizerLoading } =
    useOrganizerStatus(user?.id);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        Cookies.set('fb-token', token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        let currentUser = await initializeUser(firebaseUser);
        setUser(currentUser);
      } else {
        Cookies.remove('fb-token');
        setUser(emptyUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync the isOrganizer state with the user state
  // TODO: I am not sure if this is the best way to do this
  useEffect(() => {
    if (
      user &&
      !isOrganizerLoading &&
      isOrganizer !== undefined &&
      user.isOrganizer !== isOrganizer
    ) {
      setUser({ ...user, isOrganizer });
    }
  }, [user, isOrganizer, isOrganizerLoading]);

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
