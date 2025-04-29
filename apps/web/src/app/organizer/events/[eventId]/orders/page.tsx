import React from 'react';
import prisma from '@/server/prisma';
import OrderTable from './_components/OrderTable';
import { TicketTypes } from '@prisma/client';
import { getUserFromIdTokenCookie } from '@/server/lib/auth';
import { redirect } from 'next/navigation';

interface FetchedTicket {
  id: string;
  ticketType: Pick<TicketTypes, 'name' | 'price'> | null;
}

export interface FetchedOrder {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  total: number;
  createdAt: Date | null;
  telephoneNumber: string | null;
  billingAddress1: string | null;
  billingAddress2: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingZip: string | null;
  billingCountry: string | null;
  tickets: FetchedTicket[];
}

async function fetchOrders(
  eventId: string,
  organizerUserId: string
): Promise<FetchedOrder[]> {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        eventId: eventId,
        status: 'COMPLETED',
        event: {
          organizerUserId: organizerUserId,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        total: true,
        createdAt: true,
        telephoneNumber: true,
        billingAddress1: true,
        billingAddress2: true,
        billingCity: true,
        billingState: true,
        billingZip: true,
        billingCountry: true,
        tickets: {
          select: {
            id: true,
            ticketType: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return orders as FetchedOrder[];
  } catch (error) {
    console.error('Failed to fetch completed orders:', error);
    return [];
  }
}

interface EventOrdersPageProps {
  params: {
    eventId: string;
  };
}

// The main page component
export default async function EventOrdersPage({
  params,
}: EventOrdersPageProps) {
  const { eventId } = params;
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    redirect('/auth/signin');
  }
  const initialOrders = await fetchOrders(eventId, user.uid);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Orders</h1>
      <OrderTable initialOrders={initialOrders} />
    </div>
  );
}
