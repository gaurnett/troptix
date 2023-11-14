import Link from "next/link";
import { Button } from "./ui/button";

import React, { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = [
    { name: "Login", href: "#" },
    { name: "Explore Events", href: "/" },
    { name: "Contact", href: "#" },
    { name: "Admin", href: "/admin" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto p-4">
        <nav className="flex justify-between">
          <div className="text-2xl font-bold">Troptix</div>
          <ul className="hidden md:flex space-x-4">
            {links.map((link, index) => {
              return (
                <li key={index}>
                  <Link href={link.href} className="hover:text-gray-400">
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="mobile-menu-button">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </nav>
        <ul
          className={`mobile-menu ${mobileMenuOpen ? "" : "hidden"
            } mt-4 space-y-2 md:hidden`}
        >
          {links.map((link, index) => {
            return (
              <li key={index}>
                <Link href={link.href} className="hover:text-gray-400">
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
