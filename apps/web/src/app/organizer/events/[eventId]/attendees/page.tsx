import React from 'react';
import prisma from '@/server/prisma';
import { getUserFromIdTokenCookie } from '@/server/authUser';
import { redirect } from 'next/navigation';
import AttendeeTable from './_components/AttendeeTable'; // We will create this component next
import { TicketStatus, TicketTypes, Orders } from '@prisma/client';

// Define the structure of the data we expect to fetch
export interface FetchedTicketData {
  id: string;
  createdAt: Date | null;
  status: TicketStatus;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  ticketType: Pick<TicketTypes, 'name'> | null;
  order: Pick<Orders, 'id'> | null;
}

async function fetchTickets(eventId: string, organizerUserId: string) {
  try {
    const tickets = await prisma.tickets.findMany({
      where: {
        eventId: eventId,
        event: {
          organizerUserId: organizerUserId,
        },
        order: {
          status: 'COMPLETED',
        },
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        email: true,
        firstName: true,
        lastName: true,
        ticketType: {
          select: {
            name: true,
          },
        },
        order: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tickets;
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return [];
  }
}

interface EventAttendeesPageProps {
  params: {
    eventId: string;
  };
}

export default async function EventAttendeesPage({
  params,
}: EventAttendeesPageProps) {
  const { eventId } = params;
  const user = await getUserFromIdTokenCookie();

  // Redirect to signin if user is not authenticated
  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch the initial list of attendees (tickets)
  const initialAttendees = await fetchTickets(eventId, user.uid);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Attendees</h1>

      <AttendeeTable attendees={initialAttendees} />
    </div>
  );
}
