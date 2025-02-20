import { Menu } from 'lucide-react';
import Link from 'next/link';

import { TropTixContext } from '@/components/WebNavigator';
import AdminSidebar from '@/components/pages/admin/navigation/AdminSidebar';
import AdminSidebarMobile from '@/components/pages/admin/navigation/AdminSidebarMobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import { AppProps } from 'next/app';
import { useContext } from 'react';
import Logo from '../../components/ui/logo';
import { auth } from '../../config';

export default function AdminDashboard({ Component, pageProps }: AppProps) {
  const { user } = useContext(TropTixContext);
  const logoSize = 40;

  let items: MenuProps['items'];

  async function signOut() {
    auth;
    await auth.signOut();
  }

  items = [
    {
      key: '1',
      label: (
        <Link rel="noopener noreferrer" href="/">
          Return to TropTix
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={signOut} rel="noopener noreferrer">
          Sign Out
        </a>
      ),
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-gray-200 bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-gray-200 px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo width={logoSize} height={logoSize} />
              <span className="">TropTix Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <AdminSidebar />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <AdminSidebarMobile />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1"></div>
          <div className="mr-2">
            <ul className="flex justify-end">
              <Dropdown className="cursor-pointer" menu={{ items }}>
                <a className="inline-flex items-center justify-center leading-snug transition duration-150 ease-in-out">
                  <div style={{ fontSize: '16px' }}>{user.email}</div>
                  <DownOutlined className="ml-1 text-xs" />
                </a>
              </Dropdown>
            </ul>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 lg:gap-6 lg:p-6">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}
