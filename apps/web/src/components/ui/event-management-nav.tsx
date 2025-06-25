'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Ticket,
  Users,
  Percent,
  ScanLine,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function EventManagementNav({
  eventId,
  eventName,
}: {
  eventId: string;
  eventName: string;
}) {
  const pathname = usePathname();

  const links = [
    { name: 'Details', href: `/organizer/events/${eventId}`, icon: Settings },
    {
      name: 'Tickets',
      href: `/organizer/events/${eventId}/tickets`,
      icon: Ticket,
    },
    {
      name: 'Attendees',
      href: `/organizer/events/${eventId}/attendees`,
      icon: Users,
    },
    {
      name: 'Orders',
      href: `/organizer/events/${eventId}/orders`,
      icon: ClipboardList,
    },
    // {
    //   name: 'Promotions',
    //   href: `/organizer/events/${eventId}/promotions`,
    //   icon: Percent,
    // },
    // {
    //   name: 'Check-in',
    //   href: `/organizer/events/${eventId}/check-in`,
    //   icon: ScanLine,
    // },
  ];

  return (
    <div className="border-b bg-card rounded-xl sticky top-0 z-10">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/organizer/events"
            className="p-2 rounded-full hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div>
            <p className="text-sm text-muted-foreground">Event</p>
            <h1 className="text-2xl font-bold tracking-tight">{eventName}</h1>
          </div>
        </div>
      </div>
      <div className="container">
        <nav className="-mb-px flex gap-8 overflow-x-auto" aria-label="Tabs">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'whitespace-nowrap flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-primary/30 hover:text-primary'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
