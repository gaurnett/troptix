// app/organizer/layout.tsx
// 'use client'; // No longer needed here unless you add other client hooks/providers

import React from 'react';
import { OrganizerNavbar } from '@/components/organizer-navbar';
import { redirect } from 'next/navigation';
import { getUserFromIdTokenCookie } from '@/server/lib/auth';

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    redirect('/auth/signin');
  }
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
