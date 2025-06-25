import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { VercelToolbar } from '@vercel/toolbar/next';
import { Metadata } from 'next';

import Providers from './providers';
import '../styles/globals.css';
import Toaster from '@/components/toaster';
import Footer from '@/components/ui/footer';
import ToastTester from './_components/toast-tester';
// Replace MetaHead with the App Router's Metadata API
export const metadata: Metadata = {
  title: 'Troptix',
  description: 'Troptix is a better way to get tickets',
  // Add other global metadata tags here if needed
  // Viewport meta tag is handled by Next.js by default, but you can customize it:
  // viewport: 'initial-scale=1.0, width=device-width',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
  // const shouldInjectToasttest = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster />
          <Analytics />
          {shouldInjectToolbar && <VercelToolbar />}
          {/* {shouldInjectToasttest && <ToastTester />} */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}