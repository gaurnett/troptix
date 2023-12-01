"use client";

import { useContext, useEffect, useState } from "react";

import { Dropdown, MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "../../config";
import { TropTixContext } from "../WebNavigator";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const [top, setTop] = useState<boolean>(true);
  const { user } = useContext(TropTixContext);
  const pathname = usePathname();

  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  async function signOut() {
    await auth.signOut();
  }

  let items: MenuProps["items"];

  const userItems = [
    {
      key: "2",
      label: (
        <Link rel="noopener noreferrer" href="/account">
          Account Settings
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <a onClick={signOut} rel="noopener noreferrer">
          Sign Out
        </a>
      ),
    },
  ];

  if (user && user.isOrganizer) {
    items = [
      {
        key: "1",
        label: (
          <Link rel="noopener noreferrer" href="/admin">
            Admin Portal
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
        !top ? "bg-white backdrop-blur-sm shadow-lg" : ""
      } ${pathname.includes("/event") ? "bg-white" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-24 md:h-28">
          <div className="shrink-0 mr-4">
            <Link href={"/"}>
              <Image
                src={"/logos/logo_v1.png"}
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
                    href="/"
                    className={`${
                      pathname === "/" ? "md:text-blue-700" : ""
                    } block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className={`${
                      pathname === "/events" || pathname === "/event"
                        ? "md:text-blue-700"
                        : ""
                    } block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`${
                      pathname === "/about" ? "md:text-blue-700" : ""
                    } block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className={`${
                      pathname === "/contact" ? "md:text-blue-700" : ""
                    } block py-2 pl-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  >
                    Contact
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link
                      href="/orders"
                      className={`${
                        pathname === "/orders" ? "md:text-blue-700" : ""
                      } block py-2 pl-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                    >
                      Tickets
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="max-w-screen-xl flex flex-wrap items-center justify-end">
            <nav className="hidden md:flex">
              <div className="flex md:order-2">
                {!user ? (
                  <ul className="flex grow justify-end flex-wrap items-center">
                    <li>
                      <Link
                        href="/auth/signin"
                        className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                      >
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/auth/signup"
                        className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3"
                      >
                        <span>Sign up</span>
                        <svg
                          className="w-3 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1"
                          viewBox="0 0 12 12"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                            fillRule="nonzero"
                          />
                        </svg>
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul className="flex justify-end">
                    <Dropdown className="cursor-pointer" menu={{ items }}>
                      <a className="inline-flex items-center justify-center leading-snug transition duration-150 ease-in-out">
                        <div style={{ fontSize: "16px" }}>{user.email}</div>
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
