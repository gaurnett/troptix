// src/components/OrganizerNavbar.tsx
'use client'; // Needed for DropdownMenu interactivity

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // To highlight active links later
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants for link styling
import { cn } from '@/lib/utils'; // Utility for conditional classes

// Placeholder user data - Replace with actual data later
const organizerUser = {
  name: 'Organizer Name',
  email: 'organizer@example.com',
  avatarUrl: '/placeholder-avatar.png', // Replace with actual or remove for fallback only
  initials: 'ON', // Fallback initials
};

export function OrganizerNavbar() {
  const pathname = usePathname(); // Get current path

  const navLinks = [
    { name: 'Overview', href: '/organizer' },
    { name: 'My Events', href: '/organizer/events' },
    // Add more links as needed later
  ];

  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Left: Logo */}
      <Link href="/organizer" className="flex items-center gap-2 font-semibold">
        {/* Replace with your actual Logo component or SVG/Image */}
        <span className="text-lg font-bold">Troptix</span>
      </Link>

      {/* Middle: Navigation Links */}
      <div className="flex flex-1 justify-center">
        <div className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }), // Use button style for consistency
                'text-sm font-medium',
                pathname === link.href
                  ? 'text-primary' // Active link style
                  : 'text-muted-foreground hover:text-foreground' // Inactive link style
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Avatar Dropdown */}
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={organizerUser.avatarUrl}
                  alt={`@${organizerUser.name}`}
                />
                <AvatarFallback>{organizerUser.initials}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {organizerUser.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {organizerUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/organizer/profile">Profile</Link>{' '}
              {/* Example Link */}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/organizer/settings">Settings</Link>{' '}
              {/* Example Link */}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* Add Logout functionality later */}
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Consider adding a Mobile Menu Button/Drawer here for smaller screens */}
    </nav>
  );
}
