'use client'

import { useState, useEffect, useContext } from 'react'

import Link from 'next/link'
import Logo from './logo'
import MobileMenu from './mobile-menu'
import Image from 'next/image'
import { TropTixContext, useTropTixContext } from '../WebNavigator'

export default function Header() {

  const [top, setTop] = useState<boolean>(true);
  const { user } = useContext(TropTixContext);

  console.log(JSON.stringify(user));

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true)
  }

  useEffect(() => {
    scrollHandler()
    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [top])

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
                  <a href="#" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                </li>
                <li>
                  <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
                </li>
                <li>
                  <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
                </li>
                <li>
                  <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-screen-xl flex flex-wrap items-center justify-end p-4">
            <nav className="hidden md:flex md:grow">
              <div className='flex md:order-2'>
                {
                  user === undefined || user === null || user.name === "" ?
                    <ul className="flex grow justify-end flex-wrap items-center">
                      <li>
                        <Link href="/auth/signin" className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">Sign in</Link>
                      </li>
                      <li>
                        <Link href="/auth/signup" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
                          <span>Sign up</span>
                          <svg className="w-3 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                          </svg>
                        </Link>
                      </li>
                    </ul>
                    :
                    <Link className="flex grow justify-end flex-wrap items-center" href="/admin">
                      <div style={{ fontSize: '20px' }}>
                        Hi {user.name}
                      </div>
                    </Link>
                }
              </div>

            </nav>
          </div>

          <MobileMenu />

        </div>
      </div>
    </header>
  )
}
