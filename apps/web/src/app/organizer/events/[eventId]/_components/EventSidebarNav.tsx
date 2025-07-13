// app/organizer/events/[eventId]/_components/EventSidebarNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
}

interface EventSidebarNavProps {
  navItems: NavItem[];
}

export function EventSidebarNav({ navItems }: EventSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted' // Active style
              : 'hover:bg-transparent hover:underline', // Inactive style
            'justify-start'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
