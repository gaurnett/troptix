// app/organizer/layout.tsx

import React from 'react';
import { OrganizerNavbar } from '@/components/organizer-navbar';
import { redirect } from 'next/navigation';
import { getUserFromIdTokenCookie } from '@/server/authUser';

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
    <div className="container mx-auto flex min-h-screen flex-col">
      {' '}
      {/* Basic flex column layout */}
      {/* <OrganizerNavbar /> */}
      <main className="flex-1 py-3">{children}</main>
      {/* Optional: Add a shared footer for the organizer section here if needed */}
      {/* <footer> Organizer Footer Content </footer> */}
    </div>
  );
}
