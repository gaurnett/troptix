import React from 'react';
import prisma from '@/server/prisma';
import { getUserFromIdTokenCookie } from '@/server/authUser';
import { redirect } from 'next/navigation';
import AttendeeTable from './_components/AttendeeTable';
import { TicketStatus, TicketTypes, Orders } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Ticket } from 'lucide-react';

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

async function fetchEventName(eventId: string, organizerUserId: string) {
  try {
    const event = await prisma.events.findUnique({
      where: {
        id: eventId,
        organizerUserId: organizerUserId,
      },
      select: {
        name: true,
      },
    });
    return event?.name || 'Unknown Event';
  } catch (error) {
    console.error('Failed to fetch event name:', error);
    return 'Unknown Event';
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

  // Fetch the initial list of attendees (tickets) and event info
  const [initialAttendees, eventName] = await Promise.all([
    fetchTickets(eventId, user.uid),
    fetchEventName(eventId, user.uid),
  ]);

  // Calculate statistics
  const totalAttendees = initialAttendees.length;
  const checkedInAttendees = initialAttendees.filter(
    (ticket) => ticket.status === 'NOT_AVAILABLE'
  ).length;
  const notCheckedInAttendees = totalAttendees - checkedInAttendees;
  const checkInRate = totalAttendees > 0 ? (checkedInAttendees / totalAttendees) * 100 : 0;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Attendees</h1>
        <p className="text-muted-foreground">{eventName}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendees}</div>
            <p className="text-xs text-muted-foreground">Tickets sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{checkedInAttendees}</div>
            <p className="text-xs text-muted-foreground">Currently present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Checked In</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{notCheckedInAttendees}</div>
            <p className="text-xs text-muted-foreground">Awaiting check-in</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkInRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Attendance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendee List</CardTitle>
          <CardDescription>
            Manage check-in status for all attendees. Click the action buttons to check attendees in or out.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendeeTable attendees={initialAttendees} />
        </CardContent>
      </Card>
    </div>
  );
}
