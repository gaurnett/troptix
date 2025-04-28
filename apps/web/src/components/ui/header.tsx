'use client';

import { useContext, useEffect, useState } from 'react';

import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

  const userItems = [
    {
      key: '3',
      label: (
        <Link rel="noopener noreferrer" href="/account">
          Account Settings
        </Link>
      ),
    },
    {
      key: '4',
      label: (
        <Link rel="noopener noreferrer" href="/orders">
          Tickets
        </Link>
      ),
    },
    {
      key: '5',
      label: (
        <a onClick={signOut} rel="noopener noreferrer">
          Sign Out
        </a>
      ),
    },
  ];
  // TODO: Unfortunately I can't use the feature flag here since this is in a layout component
  // TODO: When ready we should update this for just authenticated users
  if (user && user?.isOrganizer) {
    items = [
      {
        key: '1',
        label: (
          <Link rel="noopener noreferrer" href="/admin">
            Manage Events
          </Link>
        ),
      },
      {
        key: '2',
        label: (
          <Link rel="noopener noreferrer" href="/admin/add-event">
            Create Event
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
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top ? 'bg-white backdrop-blur-sm shadow-lg' : ''
      } ${pathname?.includes('/event') ? 'bg-white' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-24 md:h-28">
          <div className="shrink-0 mr-4">
            <Link href={'/'}>
              <Image
                src={'/logos/logo_v1.png'}
                width={75}
                height={75}
                alt="troptix-logo"
              />
            </Link>
          </div>

          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-sticky"
            >
              <ul className="flex flex-col mt-4 font-medium border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    href="/events"
                    className={`${
                      pathname === '/events' || pathname === '/event'
                        ? 'md:text-blue-700'
                        : ''
                    } block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  >
                    Explore Events
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-screen-xl flex flex-wrap items-center justify-end">
            <nav className="hidden md:flex">
              <div className="flex md:order-2">
                {!user.id ? (
                  <ul className="flex grow justify-end flex-wrap items-center">
                    <li>
                      <Link href="/auth/signin" className="">
                        <Button className="font-semibold text-base" type="text">
                          Log in
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/signup" className="">
                        <Button className="font-semibold text-base" type="text">
                          Sign up
                        </Button>
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul className="flex justify-end">
                    <Dropdown className="cursor-pointer" menu={{ items }}>
                      <a className="inline-flex items-center justify-center leading-snug transition duration-150 ease-in-out">
                        <div style={{ fontSize: '16px' }}>{user.email}</div>
                        <DownOutlined className="ml-1 text-xs" />
                      </a>
                    </Dropdown>
                  </ul>
                )}
              </div>
            </nav>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
