// app/organizer/layout.tsx
// app/organizer/layout.tsx
// 'use client'; // No longer needed here unless you add other client hooks/providers

import React from 'react';
import { OrganizerNavbar } from '@/components/organizer-navbar'; // Import your Navbar

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {' '}
      {/* Basic flex column layout */}
      {/* 1. Render the Navbar */}
      <OrganizerNavbar />
      {/* 2. Render the main page content */}
      {/* Add padding to main content area */}
      <main className="flex-1 p-6 lg:p-8">{children}</main>
      {/* Optional: Add a shared footer for the organizer section here if needed */}
      {/* <footer> Organizer Footer Content </footer> */}
    </div>
  );
}
