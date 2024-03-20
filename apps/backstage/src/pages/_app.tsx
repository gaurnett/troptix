import { SideNavLayout } from '@/ components/SideNavLayout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SideNavLayout>
      <Component {...pageProps} />
    </SideNavLayout>
  );
}
