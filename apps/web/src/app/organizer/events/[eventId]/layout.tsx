import React, { Suspense } from 'react';
import { EventSidebarNav } from './_components/EventSidebarNav';
import { Skeleton } from '@/components/ui/skeleton';
import { EventNameDisplay } from './_components/EventName';

export default function EventManagementLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { eventId: string };
}) {
  const eventNavItems = [
    { name: 'Overview', href: `/organizer/events/${params.eventId}` },
    { name: 'Tickets', href: `/organizer/events/${params.eventId}/tickets` },
    {
      name: 'Attendees',
      href: `/organizer/events/${params.eventId}/attendees`,
    },
    { name: 'Orders', href: `/organizer/events/${params.eventId}/orders` },
    { name: 'Settings', href: `/organizer/events/${params.eventId}/settings` },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {' '}
      <aside className="hidden md:block w-56 flex-col border-r bg-background p-6">
        <div className="mb-8">
          <Suspense fallback={<Skeleton className="h-8 w-48" />}>
            <EventNameDisplay eventId={params.eventId} />
          </Suspense>
          <p className="text-sm text-muted-foreground">Event Menu</p>
        </div>
        <EventSidebarNav navItems={eventNavItems} />
      </aside>
      <main className="flex-1 p-1 lg:p-8 overflow-auto stable-scrollbar">
        {children}
      </main>
    </div>
  );
}
