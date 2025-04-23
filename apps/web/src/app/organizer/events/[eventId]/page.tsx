// app/organizer/events/[eventId]/page.tsx
import Link from 'next/link'; // Ensure Link is imported
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// ** Import the NEW data fetching function **
import { getSingleEventOverviewData } from './_lib/getEventData';
import { TicketTypePieChart } from './_components/TicketTypePieChart';
import { DailyPerformanceChart } from './_components/DailyPerformanceChart';
import {
  Ticket,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function EventOverviewPage({
  params,
}: {
  params: { eventId: string };
}) {
  console.log('params', params);
  // ** Fetch data using the new optimized function **
  // This will throw implicitly if event not found due to findUniqueOrThrow
  const eventData = await getSingleEventOverviewData(params.eventId);

  return (
    <div className="space-y-6">
      {/* Header - Use eventData.eventName if needed */}
      <h1 className="text-2xl font-semibold tracking-tight">Event Overview</h1>

      {/* Key Stats Cards - Uses data from eventData */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {eventData.totalRevenue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventData.ticketsSold.toLocaleString()} /{' '}
              {eventData.capacity?.toLocaleString() ?? 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {eventData.capacity && eventData.capacity > 0
                ? `${((eventData.ticketsSold / eventData.capacity) * 100).toFixed(0)}% Sold`
                : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendees Checked In
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Using placeholder rate until check-in implemented */}
            <div className="text-2xl font-bold">
              {eventData.attendeeCheckinRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              (Check-in data unavailable)
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Ticket Type Pie Chart - Passes ticketTypes array */}
      <section>
        <TicketTypePieChart data={eventData.ticketTypes} />
      </section>

      {/* Daily Performance Charts - Passes dailyPerformanceData array */}
      <section>
        {/* Ensure DailyPerformanceChart handles data format {date, tickets} */}
        <DailyPerformanceChart data={eventData.dailyPerformanceData} />
      </section>

      {/* Attendees and Orders Tables - Uses attendeesSample & recentOrders */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Attendees Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Attendees</CardTitle>
              <CardDescription>
                Preview of registered attendees.
              </CardDescription>
            </div>
            <Link
              href={`/organizer/events/${params.eventId}/attendees`}
              passHref
            >
              <Button variant="outline" size="sm" className="ml-auto gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="text-right">Checked In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventData.attendeesSample.length > 0 ? (
                  eventData.attendeesSample.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell className="font-medium">
                        {attendee.name}
                      </TableCell>
                      <TableCell>{attendee.ticketType}</TableCell>
                      <TableCell className="text-right">
                        {/* Always show XCircle due to placeholder */}
                        <XCircle
                          className="h-4 w-4 text-muted-foreground inline-block"
                          title="Check-in status not available"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No attendees yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Preview of recent ticket purchases.
              </CardDescription>
            </div>
            <Link href={`/organizer/events/${params.eventId}/orders`} passHref>
              <Button variant="outline" size="sm" className="ml-auto gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
