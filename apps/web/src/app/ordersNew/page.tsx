// app/orders/page.tsx
// Removed 'use client' directive
import prisma from '@/server/prisma';
import { getDateFormatter } from '@/lib/dateUtils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  CalendarDays,
  ListOrdered,
  MapPin,
  Ticket,
  TicketIcon,
} from 'lucide-react';
import { Order } from '@/hooks/types/Order';
import { getUserFromIdTokenCookie } from '@/server/authUser';
import { cn, getFormattedCurrency } from '@/lib/utils';
interface EventCardProps {
  imageUrl?: string; // Optional: for an event image
  eventName: string;
  eventDate: string; // Or Date object, format as needed
  eventLocation: string;
  ticketCount: number;
  eventUrl?: string; // Optional: for a "View Event" button
}

async function fetchOrders() {
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    return [];
  }
  const events = await prisma.events.findMany({
    select: {
      id: true,
      name: true,
      venue: true,
      address: true,
      imageUrl: true,
      startDate: true,
      endDate: true,
      _count: {
        select: {
          tickets: {
            where: {
              status: 'AVAILABLE',
            },
          },
        },
      },
    },
    where: {
      isDraft: false,
      tickets: {
        some: {
          email: user.email,
        },
      },
    },
  });
  return events;
}

export default async function OrdersPage() {
  const orders = await fetchOrders();
  console.log(orders);
  return (
    <div className="container mt-28 min-h-screen mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">
        My Event Tickets
      </h1>
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map((order) => (
            <EventCard
              key={order.id}
              event={order}
              className="w-full"
              // imageUrl={order.imageUrl ?? ''}
              // eventName={order.name}
              // eventDate={order.startDate.toLocaleDateString()}
              // // eventTime={order.endDate.toLocaleDateString()}
              // eventLocation={order.venue ?? ''}
              // ticketCount={order._count.tickets}
              // // eventUrl={order.eventUrl}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-10">
          <p className="text-xl">You don't have any tickets yet.</p>
          <Button className="mt-4">Browse Events</Button> {/* Example CTA */}
        </div>
      )}
    </div>
  );

  // let orders: Order[] = []; // Default to empty array
  // let fetchError: Error | null = null;
  // if (!user) {
  //   return (
  //     <div className="mt-24 flex justify-center">
  //       <Card className="w-full max-w-md text-center">
  //         <CardHeader>
  //           <div className="mx-auto mb-4">
  //             <Image
  //               width={75}
  //               height={75}
  //               src={'/icons/tickets.png'} // Ensure this path is correct and image is in /public
  //               alt={'tickets icon'}
  //             />
  //           </div>
  //           <CardTitle>Access Denied</CardTitle>
  //           <CardDescription>
  //             Please sign in or sign up with the email used to view orders.
  //           </CardDescription>
  //         </CardHeader>
  //         <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
  //           <Button asChild className="w-full sm:w-auto">
  //             <Link href={{ pathname: '/auth/signin' }}>Log In</Link>
  //           </Button>
  //           <Button asChild variant="default" className="w-full sm:w-auto">
  //             <Link href={{ pathname: '/auth/signup' }}>Sign Up</Link>
  //           </Button>
  //         </CardFooter>
  //       </Card>
  //     </div>
  //   );
  // }
  // // If user exists, try fetching orders
  // try {
  //   orders = await fetchUserOrdersServer(user.id);
  // } catch (e: unknown) {
  //   if (e instanceof Error) {
  //     fetchError = e;
  //   } else {
  //     fetchError = new Error(
  //       String(e) || 'An unexpected error occurred during data fetching.'
  //     );
  //   }
  //   console.error('Error fetching orders:', fetchError);
  // }
  // // Loading state is handled by Next.js (e.g., via a loading.tsx file) for RSCs.
  // // No explicit isPending check or Spinner is needed here.
  // if (fetchError) {
  //   return (
  //     <div className="mt-24 flex justify-center">
  //       <Card className="w-full max-w-md text-center">
  //         <CardHeader>
  //           <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
  //           <CardTitle>Error Fetching Orders</CardTitle>
  //           <CardDescription>
  //             {fetchError.message ||
  //               'An unexpected error occurred. Please try again by refreshing the page.'}
  //           </CardDescription>
  //         </CardHeader>
  //         {/*
  //           The "Try Again" button was removed.
  //           For server-side errors in RSCs, the user can refresh the browser page to retry.
  //           If client-side retry logic is specifically needed, this error display
  //           could be encapsulated in its own client component.
  //         */}
  //       </Card>
  //     </div>
  //   );
  // }
  // return (
  //   <div className="mt-20 md:mt-32 w-full md:max-w-xl mx-auto px-4">
  //     <h1
  //       className="text-center text-4xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-8"
  //       data-aos="zoom-y-out"
  //     >
  //       <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-blue-400">
  //         My Tickets
  //       </span>
  //     </h1>
  //     <div>
  //       {orders.length === 0 ? (
  //         <Card className="text-center py-10">
  //           <CardHeader>
  //             <ListOrdered className="mx-auto h-12 w-12 text-gray-400 mb-2" />
  //             <CardTitle>No Tickets Found</CardTitle>
  //             <CardDescription>
  //               You haven&apos;t purchased any tickets yet.
  //             </CardDescription>
  //           </CardHeader>
  //         </Card>
  //       ) : (
  //         <div className="space-y-6">
  //           {orders
  //             .sort(
  //               (a, b) =>
  //                 new Date(b.event.createdAt).getTime() -
  //                 new Date(a.event.createdAt).getTime()
  //             )
  //             .map((order, index) => (
  //               <Card key={order.id} className="overflow-hidden">
  //                 {' '}
  //                 {/* Assuming order.id is always present */}
  //                 <Link
  //                   href={{
  //                     pathname: '/order-details',
  //                     query: { orderId: order.id },
  //                   }}
  //                   className="block hover:bg-muted/50 transition-colors"
  //                 >
  //                   <CardContent className="p-0">
  //                     <div className="flex">
  //                       <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] flex-shrink-0">
  //                         <Image
  //                           fill
  //                           className="object-cover"
  //                           src={order.event.imageUrl} // Ensure this is a valid public path or absolute URL
  //                           alt={`${order.event.name} flyer`}
  //                           sizes="(max-width: 640px) 120px, 150px"
  //                         />
  //                       </div>
  //                       <div className="p-4 sm:p-6 flex-grow min-w-0">
  //                         <h3 className="font-bold text-lg sm:text-xl truncate">
  //                           {order.event.name}
  //                         </h3>
  //                         <p className="text-sm text-muted-foreground">
  //                           {order.event.venue}
  //                         </p>
  //                         <p className="text-sm text-muted-foreground truncate">
  //                           {order.event.address}
  //                         </p>
  //                         <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
  //                           {getDateFormatter(new Date(order.event.startDate))}
  //                         </p>
  //                       </div>
  //                     </div>
  //                   </CardContent>
  //                 </Link>
  //                 {index < orders.length - 1 && <Separator />}
  //               </Card>
  //             ))}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}

export function EventCard({ event, className }) {
  const displayDate = new Date(event.startDate).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const displayTime = new Date(event.startDate).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const displayImageUrl =
    event.imageUrl ?? 'https://placehold.co/600x400?text=Event+Image';

  const altText = `Flyer or image for ${event.name}`;
  const eventUrl = `/orders/${event.id}`;

  return (
    <Link
      href={eventUrl}
      className={cn(
        'block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg',
        className
      )}
      aria-label={`View details for ${event.name}`}
    >
      <Card
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          'flex flex-row p-3 border group-hover:bg-muted/50 group-focus:bg-muted/50 md:border-none md:p-0', // Mobile
          'md:relative md:h-[350px] md:shadow-sm group-hover:md:shadow-xl group-focus:md:shadow-xl' // Desktop
        )}
      >
        <div
          className={cn(
            'relative flex-shrink-0 w-[100px] h-[100px] sm:w-[125px] sm:h-[125px] rounded overflow-hidden', // Mobile
            'md:absolute md:inset-0 md:w-full md:h-full md:rounded-lg' // Desktop
          )}
        >
          <Image
            src={displayImageUrl}
            alt={altText}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 125px, 100vw"
          />
        </div>

        <div
          className={cn(
            'ml-4 flex flex-col justify-center overflow-hidden flex-grow', // Mobile: flex-grow to push ticket count down if desired, or manage spacing with mt-auto on the ticket count div
            'md:absolute md:inset-x-0 md:bottom-0 md:ml-0 md:p-4 md:bg-background/90 md:backdrop-blur-sm md:rounded-b-lg md:flex md:flex-col' // Desktop
          )}
        >
          {/* Top section of text details */}
          <div>
            <h3 className="font-semibold text-lg leading-tight truncate md:text-xl group-hover:text-primary">
              {event.name}
            </h3>
            <p className="text-sm text-primary mt-1 md:text-base">
              {displayDate}{' '}
              <span className="hidden sm:inline">at {displayTime}</span>
            </p>

            {event.venue && (
              <p className="text-sm text-muted-foreground mt-1 truncate md:text-base">
                {event.venue}
              </p>
            )}
          </div>

          {/* User's Ticket Count - Placed at the bottom of this content block */}
          {event._count.tickets !== undefined && event._count.tickets > 0 && (
            <div className="mt-2 md:mt-3 flex items-center">
              {' '}
              {/* Use mt-auto here if you want to push it to the very bottom of this div */}
              <Badge variant="secondary" className="px-2.5 py-0.5 text-sm">
                {event._count.tickets}
                <TicketIcon className="w-4 h-4 ml-1 text-muted-foreground" />
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
