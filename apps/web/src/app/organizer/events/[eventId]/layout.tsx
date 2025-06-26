import React from 'react';
import { EventManagementNav } from '@/components/ui/event-management-nav';
import prisma from '@/server/prisma';
import { notFound } from 'next/navigation';

async function getEvent(eventId: string) {
  const event = await prisma.events.findUnique({
    where: { id: eventId },
    select: { name: true, isDraft: true },
  });
  if (!event) {
    notFound();
  }
  return event;
}

export default async function EventManagementLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { eventId: string };
}) {
  const event = await getEvent(params.eventId);

  return (
    <div>
      <EventManagementNav eventId={params.eventId} eventName={event.name} isDraft={event.isDraft} />
      <div className="mt-4 mx-auto">{children}</div>
    </div>
  );
}
