'use client'

import { useContext, useEffect, useState } from 'react'

import { Disclosure } from '@headlessui/react'
import { Dropdown, MenuProps } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GiHamburgerMenu } from "react-icons/gi"

import {
  MdAdd,
  MdOutlineEvent,
  MdOutlineLogout,
  MdOutlineMoreHoriz,
  MdOutlineSettings,
} from "react-icons/md"

import { usePathname } from 'next/navigation'
import { AiOutlineHome } from "react-icons/ai"
import { auth } from '../../config'
import { TropTixContext } from '../WebNavigator'
import AdminMobileMenu from './admin-mobile-menu'

export default function AdminHeader() {
  const { user } = useContext(TropTixContext);
  const pathname = usePathname();
  const [top, setTop] = useState<boolean>(true)

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true)
  }

  const router = useRouter();

  useEffect(() => {
    scrollHandler()
    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [top]);

  async function signOut() {
    await auth.signOut();
    router.push('/');
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link rel="noopener noreferrer" href="/">
          Home
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={signOut} rel="noopener noreferrer">
          Sign Out
        </a>
      ),
    },
  ];

  function oldNavBar() {

    return (
      <div>
        <aside className='w-full md:w-60 h-screen'>
          <div>
            <Disclosure as="nav">
              <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
                <GiHamburgerMenu
                  className="block md:hidden h-6 w-6"
                  aria-hidden="true"
                />
              </Disclosure.Button>
              <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
                <div className="flex flex-col justify-center item-center">
                  <Link href={"/"}>
                    <Image className="text-center cursor-pointer pb-4 mx-auto" src={"/logos/logo_v1.png"} width={100} height={100} alt='troptix-logo' />
                  </Link>
                  <div className=" my-4 border-b border-gray-100 pb-4">
                    <Link href={'/admin/add-event'}>
                      <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                        <AiOutlineHome className="text-2xl text-gray-600 group-hover:text-white " />
                        <h3 className="text-base text-gray-800 group-hover:text-white font-medium">
                          Home
                        </h3>
                      </div>
                    </Link>
                    <Link href={'/admin/manage-events'}>
                      <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                        <MdOutlineEvent className="text-2xl text-gray-600 group-hover:text-white " />
                        <h3 className="text-base text-gray-800 group-hover:text-white font-medium">
                          Events
                        </h3>
                      </div>
                    </Link>
                    <Link href={'/admin/add-event'}>
                      <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                        <MdAdd className="text-2xl text-gray-600 group-hover:text-white " />
                        <h3 className="text-base text-gray-800 group-hover:text-white font-medium">
                          Add Event
                        </h3>
                      </div>
                    </Link>
                  </div>
                  {/* setting  */}
                  <div className=" my-4 border-b border-gray-100 pb-4">
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <MdOutlineSettings className="text-2xl text-gray-600 group-hover:text-white " />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-medium ">
                        Settings
                      </h3>
                    </div>
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <MdOutlineMoreHoriz className="text-2xl text-gray-600 group-hover:text-white " />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-medium ">
                        More
                      </h3>
                    </div>
                  </div>
                  {/* logout */}
                  <div className=" my-4">
                    <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200  hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                      <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white " />
                      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                        Logout
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </Disclosure>
          </div>
        </aside>
      </div>
    )
  }

  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top ? 'bg-white backdrop-blur-sm shadow-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-24 md:h-28">
          <div className="shrink-0 mr-4">
            <Link href={"/"}>
              <Image src={"/logos/logo_v1.png"} width={75} height={75} alt='troptix-logo' />
            </Link>
          </div>

          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link href="/admin/manage-account" className={`${pathname === '/admin' || pathname === '/admin/manage-account' || pathname === '/admin/manage-account' ? 'md:text-blue-700' : ''} block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}> Account</Link>
                </li>
                <li>
                  <Link href="/admin/manage-events" className={`${pathname === '/admin/manage-events' || pathname === '/admin/manage-event' ? 'md:text-blue-700' : ''} block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}>Manage Events</Link>
                </li>
                <li>
                  <Link href="/admin/add-event" className={`${pathname === '/admin/add-event' ? 'md:text-blue-700' : ''} block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}>Add Event</Link>
                </li>
              </ul>
            </div>
          </div>

          {
            !user
              ? <></>
              :
              <div className="max-w-screen-xl flex flex-wrap items-center justify-end">
                <nav className="hidden md:flex">
                  <div className='flex md:order-2'>
                    <Dropdown className='cursor-pointer' menu={{ items }}>
                      <a className="inline-flex items-center justify-center leading-snug transition duration-150 ease-in-out">
                        <div style={{ fontSize: '16px' }}>
                          {user.email}
                        </div>
                      </a>
                    </Dropdown>
                  </div>

                </nav>
              </div>
          }

          <AdminMobileMenu />

        </div>
      </div>
    </header>
  )
}