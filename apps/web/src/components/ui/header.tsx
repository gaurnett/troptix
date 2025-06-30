'use client';

import { useContext, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { auth } from '../../config';
import { TropTixContext } from '../AuthProvider';
import MobileMenu from './mobile-menu';

export default function Header() {
  const [top, setTop] = useState<boolean>(true);
  const { user } = useContext(TropTixContext);
  const pathname = usePathname();

  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  async function signOut() {
    await auth.signOut();
  }

  let items: MenuProps['items'];

  const navItems = [
    {
      key: '1',
      label: (
        <Link
          href="/events"
          className={`relative px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            pathname === '/events' || pathname === '/event'
              ? 'text-primary-foreground bg-gradient-to-r from-primary to-chart-1 shadow-lg'
              : 'text-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-1/10'
          }`}
        >
          Explore Events
        </Link>
      ),
    },
  ];

  const organizerItems = [
    {
      key: '1',
      label: (
        <Link 
          rel="noopener noreferrer" 
          href="/organizer/events"
          className="relative px-4 py-2 rounded-full font-medium text-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-1/10 transition-all duration-300"
        >
          Your Events
        </Link>
      ),
    },
  ];

  const userItems = [
    {
      key: '2',
      label: (
        <Link rel="noopener noreferrer" href="/orders">
          Tickets
        </Link>
      ),
    },
    {
      key: '3',
      label: (
        <a onClick={signOut} rel="noopener noreferrer">
          Sign Out
        </a>
      ),
    },
  ];

  if (user && user?.isOrganizer) {
    items = [
      {
        key: '1',
        label: (
          <Link rel="noopener noreferrer" href="/organizer">
            Dashboard
          </Link>
        ),
      },
      ...userItems,
    ];
  } else {
    items = [...userItems];
  }

  return (
    <header
      className={`fixed w-full z-30 transition-all duration-300 ease-in-out ${
        !top 
          ? 'bg-gradient-to-r from-background/95 via-accent/20 to-background/95 backdrop-blur-md shadow-xl border-b border-primary/20' 
          : 'bg-gradient-to-r from-background/80 to-accent/10 backdrop-blur-sm'
      } ${pathname?.includes('/event') ? 'bg-gradient-to-r from-background via-accent/10 to-background backdrop-blur-md' : ''}`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-chart-1/10 blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-chart-2/10 to-chart-3/10 blur-xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo with enhanced styling */}
          <div className="shrink-0 mr-4">
            <Link href={'/'} className="group">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-card/50 to-background/50 border border-primary/20 group-hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
                <Image
                  src={'/logos/logo_v1.png'}
                  width={60}
                  height={60}
                  alt="troptix-logo"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <nav className="flex items-center gap-2">
              {pathname?.includes('/organizer')
                ? organizerItems.map((item) => (
                    <div key={item.key}>{item.label}</div>
                  ))
                : navItems.map((item) => (
                    <div key={item.key}>{item.label}</div>
                  ))}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center justify-end">
            <nav className="hidden md:flex items-center gap-3">
              {!user.id ? (
                <div className="flex items-center gap-3">
                  <Link href="/auth/signin">
                    <Button 
                      type="text" 
                      className="font-semibold text-base text-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-1/10 border-0 transition-all duration-300"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button 
                      className="font-semibold text-base bg-gradient-to-r from-primary to-chart-2 text-primary-foreground border-0 hover:from-chart-1 hover:to-chart-3 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              ) : (
                <Dropdown 
                  className="cursor-pointer" 
                  menu={{ items }}
                  placement="bottomRight"
                >
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-card/50 to-background/50 border border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
                    <div className="text-sm font-medium text-foreground mr-2">{user.email}</div>
                    <DownOutlined className="text-xs text-primary" />
                  </div>
                </Dropdown>
              )}
            </nav>
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
