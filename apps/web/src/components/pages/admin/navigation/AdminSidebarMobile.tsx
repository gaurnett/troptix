import { Plus, SquareGanttChart } from 'lucide-react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import React from 'react';
import Logo from '../../../ui/logo';

interface Item {
  path: string;
  title: string;
  isCurrent: boolean;
  icon: any;
}

export default function AdminSidebarMobile() {
  const pathname = usePathname();
  const logoSize = 40;

  function renderItem(item: Item) {
    return (
      <Link
        href={item.path}
        className={`${item.isCurrent ? 'bg-stone-200' : ''} mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
      >
        {item.icon}
        {item.title}
      </Link>
    );
  }

  return (
    <nav className="grid gap-2 text-lg font-medium">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Logo width={logoSize} height={logoSize} />
        <span className="">TropTix Admin</span>
      </Link>

      {renderItem({
        path: '/admin/manage-events',
        title: 'Manage Events',
        isCurrent: pathname.includes('/manage-event') || pathname === '/admin',
        icon: <SquareGanttChart className="h-5 w-5" />,
      })}

      {renderItem({
        path: '/admin/add-event',
        title: 'Add Event',
        isCurrent: pathname.includes('add-event'),
        icon: <Plus className="h-5 w-5" />,
      })}
    </nav>
  );
}
