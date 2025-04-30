import React from 'react';
import prisma from '@/server/prisma';
import TicketTable from './_components/TicketTable'; // Update the import path to the colocated component
import { getUserFromIdTokenCookie } from '@/server/authUser';
import { redirect } from 'next/navigation';

interface FetchedTicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  quantitySold: number | null;
  saleStartDate: Date;
  saleEndDate: Date;
}

async function fetchTicketTypes(
  eventId: string,
  organizerUserId: string
): Promise<FetchedTicketType[]> {
  console.log(`Fetching ticket types for event: ${eventId}`);
  try {
    const ticketTypes = await prisma.ticketTypes.findMany({
      where: {
        eventId: eventId,
        event: {
          organizerUserId: organizerUserId,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        quantity: true,
        quantitySold: true,
        saleStartDate: true,
        saleEndDate: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return ticketTypes;
  } catch (error) {
    console.error('Failed to fetch ticket types:', error);
    return [];
  }
}

interface EventTicketsPageProps {
  params: {
    eventId: string;
  };
}

export default async function EventTicketsPage({
  params,
}: EventTicketsPageProps) {
  const { eventId } = params;
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    redirect('/auth/signin');
  }
  const initialTicketTypes = await fetchTicketTypes(eventId, user.uid);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Tickets</h1>
      <TicketTable eventId={eventId} initialTicketTypes={initialTicketTypes} />
    </div>
  );
}
