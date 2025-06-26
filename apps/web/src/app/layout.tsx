import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { VercelToolbar } from '@vercel/toolbar/next';
import { Metadata } from 'next';

import Providers from './providers';
import '../styles/globals.css';
import Toaster from '@/components/toaster';
import Footer from '@/components/ui/footer';

export const metadata: Metadata = {
  title: 'Troptix',
  description: 'Troptix is a better way to get tickets',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster />
          <Analytics />
          {shouldInjectToolbar && <VercelToolbar />}
        </Providers>
      </body>
    </html>
  );
}
