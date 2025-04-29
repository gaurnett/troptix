import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TicketSalesChart } from './_components/TicketSalesChart';
import { ArrowUpRight, DollarSign, Ticket, CalendarClock } from 'lucide-react';
import { getOrganizerDashboardDataOptimized } from './_lib/getDashboardData';

import { redirect } from 'next/navigation';
import { getUserFromIdTokenCookie } from '@/server/authUser';

export default async function OrganizerDashboardPage() {
  // Fetch data using the optimized function
  const user = await getUserFromIdTokenCookie();
  if (!user) {
    redirect('/auth/signin');
  }
  const dashboardData = await getOrganizerDashboardDataOptimized(user.uid);

  return (
    <div className="space-y-6">
      {' '}
      {/* Optional: Add overall vertical spacing if needed */}
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      {/* Main Grid Layout (2 columns on large screens, 1 on small) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left Column (Recent Orders) */}
        <div className="lg:col-span-1 space-y-6">
          {' '}
          {/* Use space-y for elements within this column */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Last 5 completed orders.</CardDescription>
              </div>
              <Link href={`/organizer/orders`} passHref>
                {' '}
                {/* Link to full orders page */}
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
                    {/* Simplified columns for preview */}
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    {/* <TableHead>Status</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentOrdersForTable.length > 0 ? (
                    dashboardData.recentOrdersForTable.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell
                          className="font-medium truncate"
                          title={order.customerDisplay}
                        >
                          {order.customerDisplay}
                        </TableCell>
                        <TableCell className="text-right">
                          ${order.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            order.date + 'T00:00:00'
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        {/* <TableCell><Badge variant="outline">{order.status}</Badge></TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No recent orders found.
                      </TableCell>
                    </TableRow> // Adjusted colspan
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Existing Content) */}
        <div className="lg:col-span-2 space-y-6">
          {' '}
          {/* Use space-y for elements within this column */}
          {/* 1. Top Metrics Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {' '}
            {/* Adjust grid for space */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {dashboardData.totalRevenue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tickets Sold
                </CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.totalTicketsSold.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Events
                </CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.activeEventsCount}
                </div>
              </CardContent>
            </Card>
          </section>
          {/* 2. Chart */}
          <section>
            {/* Ensure DailyPerformanceChart component is ready */}
            <TicketSalesChart data={dashboardData.dailySalesChartData} />
          </section>
          {/* 3. Active Events List */}
          <section>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Active Events</CardTitle>
                <Link href="/organizer/events">
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
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Sold</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.activeEventsForTable.length > 0 ? (
                      dashboardData.activeEventsForTable.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell
                            className="font-medium truncate"
                            title={event.name}
                          >
                            {event.name}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              event.date + 'T00:00:00'
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {event.ticketsSold.toLocaleString()}/
                            {event.capacity?.toLocaleString() ?? 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/organizer/events/${event.id}`}
                              passHref
                            >
                              <Button variant="ghost" size="sm">
                                Manage
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No active events found.
                        </TableCell>
                      </TableRow> // Adjusted colspan
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>{' '}
      {/* End Main Grid */}
    </div>
  );
}
