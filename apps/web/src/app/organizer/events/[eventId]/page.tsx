import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Ticket,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Copy,
  Share2,
  Clock,
  CalendarDays,
  Filter,
  Search,
  PieChart as PieChartIcon,
  CheckCheck,
} from 'lucide-react';
import { differenceInDays, format, isValid } from 'date-fns'; // For date calculations

import { getSingleEventOverviewData } from './_lib/getEventData'; // Assuming your path is correct

import { TicketTypePieChart } from './_components/TicketTypePieChart';
import { DailyRevenueChart } from './_components/DailyRevenueChart';
import { getUserFromIdTokenCookie } from '@/server/authUser';
import { redirect } from 'next/navigation';

function calculateDaysUntil(
  startDate: Date | null | undefined
): number | string {
  if (!startDate || !isValid(startDate)) {
    return 'N/A';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(startDate);
  eventDate.setHours(0, 0, 0, 0);

  const days = differenceInDays(eventDate, today);
  return days >= 0 ? days : 0;
}

export default async function EventOverviewPage({
  params,
}: {
  params: { eventId: string };
}) {
  const eventId = params.eventId;
  let eventData;
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    redirect('/auth/signin');
  }

  try {
    eventData = await getSingleEventOverviewData(eventId, user.uid);
  } catch (error) {
    // TODO: Add error handling
    console.error('Failed to fetch event data:', error);

    return <p>Error loading event data.</p>; // Fallback message
  }

  const daysRemaining = calculateDaysUntil(eventData.startDate);
  const eventUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/events/${eventId}`; // Construct event URL (ensure NEXT_PUBLIC_BASE_URL is set in .env)

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {eventData.eventName}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{eventData.status}</Badge>{' '}
              <span className="text-xs text-muted-foreground">
                {/* TODO: Add created date */}
                Created: {format(new Date(), 'PP')}
              </span>
            </div>
          </div>
          <Link href={`/events/${eventId}`} passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <Button variant="outline">View Event Page</Button>
            </a>
          </Link>
        </div>
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1.5">
          <Input
            readOnly
            value={eventUrl}
            className="flex-grow border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 h-auto text-sm"
          />
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy link</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share link</span>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tickets Sold
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventData.ticketsSold.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {eventData.totalRevenue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">Gross Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Days Until Event
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysRemaining}{' '}
              {typeof daysRemaining === 'number' && daysRemaining !== 1
                ? 'days'
                : typeof daysRemaining === 'number'
                  ? 'day'
                  : ''}
            </div>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
      </section>

      {/* Todo: Add logic to handle different time periods */}
      {/* <section className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Day
        </Button>
        <Button variant="outline" size="sm">
          Week
        </Button>
        <Button variant="outline" size="sm">
          Month
        </Button>
        <Button variant="outline" size="sm">
          YTD
        </Button>
        <Button variant="secondary" size="sm">
          All Time
        </Button>
      </section> */}

      {/* <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              $
              {eventData.totalRevenue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Tickets Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {eventData.ticketsSold.toLocaleString()}
            </div>
            {eventData.capacity && eventData.capacity > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {`out of ${eventData.capacity.toLocaleString()} capacity (${((eventData.ticketsSold / eventData.capacity) * 100).toFixed(0)}%)`}
              </p>
            )}
          </CardContent>
        </Card>
      </section> */}

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>
              Showing ticket sales trend for the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyRevenueChart data={eventData.dailyPerformanceData} />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest ticket purchases for this event.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {/* TODO: Add search and filter */}
                {/* <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search orders..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter orders</span>
                </Button> */}
                <Link
                  href={`/organizer/events/${eventId}/orders`}
                  passHref
                  legacyBehavior
                >
                  <Button variant="outline" size="sm" asChild>
                    <a>
                      View All Orders
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventData.recentOrders.length > 0 ? (
                  eventData.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerDisplay}</TableCell>
                      <TableCell className="text-right">
                        ${order.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <Ticket className="mx-auto h-8 w-8 mb-2" />
                      No orders yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets Scanned (Check-in)
            </CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round((eventData.attendeeCheckinRate / 100) * eventData.ticketsSold)} / {eventData.ticketsSold.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tickets Scanned ({eventData.attendeeCheckinRate.toFixed(1)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets Sold by Type
            </CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {eventData.ticketTypes.length > 0 ? (
              <TicketTypePieChart data={eventData.ticketTypes} />
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                No ticket types sold yet.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
