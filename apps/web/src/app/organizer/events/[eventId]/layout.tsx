// app/organizer/events/[eventId]/layout.tsx
import React from 'react';
import { EventSidebarNav } from './_components/EventSidebarNav'; // Client component for Nav
import { getSingleEventOverviewData } from './_lib/getEventData'; // Assume data fetching logic is here

export default async function EventManagementLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { eventId: string };
}) {
  // Fetch minimal event data needed for layout context (e.g., name)
  // Note: Fetching here means layout might re-fetch often, consider alternatives if performance is critical
  const event = await getSingleEventOverviewData(params.eventId); // Use await if fetching is async

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
      {/* Adjust min-height based on navbar */}
      {/* Event Specific Sidebar */}
      <aside className="hidden md:block w-56 flex-col border-r bg-background p-6">
        <div className="mb-8">
          <h2
            className="text-xl font-semibold tracking-tight truncate"
            title={event.name}
          >
            {event.name || 'Manage Event'}
          </h2>
          <p className="text-sm text-muted-foreground">Event Menu</p>
        </div>
        {/* Navigation - Extracted to Client Component for active state */}
        <EventSidebarNav navItems={eventNavItems} />
      </aside>
      {/* Main Content Area for the specific event page */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Render the specific page (Overview, Tickets, etc.) */}
        {children}
      </main>
    </div>
  );
}
