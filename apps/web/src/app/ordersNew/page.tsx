// app/orders/page.tsx
// Removed 'use client' directive

import { getDateFormatter } from '@/lib/dateUtils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, ListOrdered } from 'lucide-react';

// --- USER ACTION REQUIRED: Define these types according to your actual data model ---
interface Event {
  id: string;
  name: string;
  venue: string;
  address: string;
  imageUrl: string;
  startDate: string; // Consider using Date type if transforming early
  createdAt: string; // Consider using Date type, used for sorting
}

interface Order {
  id: string;
  event: Event;
  // Add other relevant order properties here
}

interface User {
  id: string;
  // Add other relevant user properties, e.g., email, name
}
// --- END USER ACTION REQUIRED ---

// --- USER ACTION REQUIRED: Implement these server-side functions ---
// These are placeholders. Replace them with your actual authentication and data fetching logic.
// Consider moving these to appropriate files in your `lib` or `server/actions` directory.

async function getCurrentUserServer(): Promise<User | null> {
  // Example: using next-auth
  // import { auth } from "@/auth"; // (if you set up auth.ts)
  // const session = await auth();
  // if (!session?.user) return null;
  // return session.user as User; // Adjust type casting as needed

  console.warn(
    'Using placeholder getCurrentUserServer. Please implement your actual server-side authentication logic.'
  );
  // Simulate a logged-in user for demonstration.
  // To test signed-out state: return null;
  // To test signed-in state: return { id: 'mock-user-123' };
  return { id: 'mock-user-123' };
  // return null;
}

async function fetchUserOrdersServer(userId: string): Promise<Order[]> {
  // Example: fetching from an API or database
  // const response = await fetch(`https://your-api.com/users/${userId}/orders`, {
  //   headers: { Authorization: `Bearer YOUR_API_TOKEN` },
  // });
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch orders: ${response.statusText}`);
  // }
  // return response.json();

  console.warn(
    'Using placeholder fetchUserOrdersServer. Please implement your actual server-side data fetching logic.'
  );
  // Simulate fetching orders.
  // To test error state: throw new Error("Simulated data fetch error from server");
  // To test empty orders: return [];
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // To test error state:
      // reject(new Error("Simulated data fetch error")); return;
      resolve([
        {
          id: 'order-server-1',
          event: {
            id: 'event-server-1',
            name: 'RSC Live Concert',
            venue: 'The Server Arena',
            address: '123 Render Street, Nextville',
            imageUrl: '/icons/tickets.png', // Replace with a valid public image path
            startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        },
        {
          id: 'order-server-2',
          event: {
            id: 'event-server-2',
            name: 'Server-Side Summit',
            venue: 'Component Hall',
            address: '456 Data Ave, Web City',
            imageUrl: '/icons/tickets.png', // Replace with a valid public image path
            startDate: new Date(Date.now() + 86400000 * 14).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
        },
      ]);
    }, 500);
  });
}
// --- END USER ACTION REQUIRED ---

export default async function OrdersPage() {
  let orders: Order[] = []; // Default to empty array
  let fetchError: Error | null = null;

  const user = await getCurrentUserServer();

  if (!user) {
    return (
      <div className="mt-24 flex justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Image
                width={75}
                height={75}
                src={'/icons/tickets.png'} // Ensure this path is correct and image is in /public
                alt={'tickets icon'}
              />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in or sign up with the email used to view orders.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
            <Button asChild className="w-full sm:w-auto">
              <Link href={{ pathname: '/auth/signin' }}>Log In</Link>
            </Button>
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href={{ pathname: '/auth/signup' }}>Sign Up</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If user exists, try fetching orders
  try {
    orders = await fetchUserOrdersServer(user.id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      fetchError = e;
    } else {
      fetchError = new Error(
        String(e) || 'An unexpected error occurred during data fetching.'
      );
    }
    console.error('Error fetching orders:', fetchError);
  }

  // Loading state is handled by Next.js (e.g., via a loading.tsx file) for RSCs.
  // No explicit isPending check or Spinner is needed here.

  if (fetchError) {
    return (
      <div className="mt-24 flex justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <CardTitle>Error Fetching Orders</CardTitle>
            <CardDescription>
              {fetchError.message ||
                'An unexpected error occurred. Please try again by refreshing the page.'}
            </CardDescription>
          </CardHeader>
          {/* 
            The "Try Again" button was removed. 
            For server-side errors in RSCs, the user can refresh the browser page to retry.
            If client-side retry logic is specifically needed, this error display
            could be encapsulated in its own client component.
          */}
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-20 md:mt-32 w-full md:max-w-xl mx-auto px-4">
      <h1
        className="text-center text-4xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-8"
        data-aos="zoom-y-out"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-blue-400">
          My Tickets
        </span>
      </h1>
      <div>
        {orders.length === 0 ? (
          <Card className="text-center py-10">
            <CardHeader>
              <ListOrdered className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <CardTitle>No Tickets Found</CardTitle>
              <CardDescription>
                You haven&apos;t purchased any tickets yet.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders
              .sort(
                (a, b) =>
                  new Date(b.event.createdAt).getTime() -
                  new Date(a.event.createdAt).getTime()
              )
              .map((order, index) => (
                <Card key={order.id} className="overflow-hidden">
                  {' '}
                  {/* Assuming order.id is always present */}
                  <Link
                    href={{
                      pathname: '/order-details',
                      query: { orderId: order.id },
                    }}
                    className="block hover:bg-muted/50 transition-colors"
                  >
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] flex-shrink-0">
                          <Image
                            fill
                            className="object-cover"
                            src={order.event.imageUrl} // Ensure this is a valid public path or absolute URL
                            alt={`${order.event.name} flyer`}
                            sizes="(max-width: 640px) 120px, 150px"
                          />
                        </div>
                        <div className="p-4 sm:p-6 flex-grow min-w-0">
                          <h3 className="font-bold text-lg sm:text-xl truncate">
                            {order.event.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.event.venue}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {order.event.address}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {getDateFormatter(new Date(order.event.startDate))}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                  {index < orders.length - 1 && <Separator />}
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
