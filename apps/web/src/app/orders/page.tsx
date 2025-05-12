// app/orders/page.tsx
import prisma from '@/server/prisma';
import { getDateFormatter, formatTime } from '@/lib/dateUtils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ListOrdered, Ticket } from 'lucide-react';
import { getUserFromIdTokenCookie } from '@/server/authUser';
type UserOrder = {
  id: string;
  createdAt: Date;
  event: {
    id: string;
    name: string | null;
    venue: string | null;
    address: string | null;
    imageUrl: string | null;
    startDate: Date;
  } | null;
  _count: {
    tickets: number;
  };
};

async function fetchUserOrders(): Promise<UserOrder[]> {
  const user = await getUserFromIdTokenCookie();
  if (!user?.email) {
    console.log('User not found or user ID missing for fetching orders.');
    return [];
  }

  try {
    const userOrders = await prisma.orders.findMany({
      where: {
        email: user.email,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        createdAt: true,
        event: {
          select: {
            id: true,
            name: true,
            venue: true,
            address: true,
            imageUrl: true,
            startDate: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            tickets: true,
          },
        },
      },
      orderBy: {
        event: {
          startDate: 'desc',
        },
      },
    });
    return userOrders as UserOrder[];
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await fetchUserOrders();

  return (
    <div className="container mt-20 w-full md:mt-28  min-h-screen px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your Tickets
        </h1>
      </div>

      {orders.length > 0 ? (
        <div className="grid items-center justify-center grid-cols-1 gap-4 w-full mx-auto">
          {orders.map((order) => {
            const cardOrderProps = {
              id: order.id,
              name: order.event?.name || 'Event Name N/A',
              date: order.event?.startDate
                ? getDateFormatter(
                    new Date(order.event.startDate),
                    'MMM dd, yyyy'
                  )
                : 'Date N/A',
              time: order.event?.startDate
                ? formatTime(new Date(order.event.startDate))
                : 'Time N/A',
              venue: order.event?.venue || 'Venue N/A',
              imageUrl: order.event?.imageUrl || '', // Provide a default empty string or placeholder URL
              ticketCount: order._count.tickets,
              createdAt: order.createdAt,
            };
            return (
              <OrderCard
                key={order.id}
                order={cardOrderProps}
                isPastEvent={false}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-16 py-10 border rounded-lg">
          <ListOrdered className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-semibold">
            Looks like you haven't purchased any tickets yet.
          </p>
          <p className="text-sm mt-1 mb-6">
            When you purchase tickets, they will appear here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

type OrderCardProps = {
  order: {
    id: string;
    name: string;
    date: string;
    time: string;
    venue: string;
    imageUrl: string;
    ticketCount: number;
    createdAt: Date;
  };
  isPastEvent: boolean;
};

const OrderCard = ({ order, isPastEvent = false }: OrderCardProps) => {
  if (!order) {
    return null;
  }

  const { id, name, date, time, venue, imageUrl, ticketCount, createdAt } =
    order;

  const cardBaseClasses =
    'max-w-lg bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300 flex flex-row items-center space-y-0 space-x-4 mx-auto';
  const pastEventClasses = isPastEvent ? 'past-event-card opacity-85' : '';

  return (
    <div className={`${cardBaseClasses} ${pastEventClasses}`}>
      <Link href={`/orders/${id}`}>
        <div className="w-full" key={id}>
          <div className="flex">
            <div className="my-auto">
              <Image
                width={150}
                height={150}
                className="w-auto rounded"
                style={{
                  objectFit: 'cover',
                  width: 150,
                  height: 150,
                  maxHeight: 150,
                  maxWidth: 150,
                }}
                src={imageUrl}
                alt={'event flyer image'}
              />
            </div>
            <div className="ml-4 my-auto grow w-full ">
              <div className="font-bold text-xl">{name}</div>
              <div className="text-base">{venue}</div>
              <div className="text-base ">{date}</div>
              <div className="text-base ">{time}</div>
              <div className="text-base text-secondard-foreground">
                Order Placed: {createdAt.toLocaleDateString()}
              </div>
              {/* Ticket Count with Icon */}
              <div className="flex items-center mt-2">
                <Ticket className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
