// app/organizer/layout.tsx
// 'use client'; // No longer needed here unless you add other client hooks/providers

import React from 'react';
import { OrganizerNavbar } from '@/components/organizer-navbar';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {' '}
      {/* Basic flex column layout */}
      <OrganizerNavbar />
      {/* Remove padding from main content area here */}
      <main className="flex-1">{children}</main>
      {/* Optional: Add a shared footer for the organizer section here if needed */}
      {/* <footer> Organizer Footer Content </footer> */}
    </div>
  );
}
