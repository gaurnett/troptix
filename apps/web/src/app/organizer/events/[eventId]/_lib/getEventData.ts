// app/organizer/events/[eventId]/_lib/data.ts

import { OrderStatus, Prisma } from '@prisma/client';
import { notFound } from 'next/navigation'; // Import notFound for error handling
import prisma from '@/server/prisma';

// Define types for the data structure we'll return
export type TicketTypeBreakdown = {
  name: string;
  sold: number;
  fill: string; // For chart colors
};

export type DailyPerformanceDataPoint = {
  date: string;
  tickets: number;
  // revenue: number; // Add later if needed
};

export type AttendeeSample = {
  id: string;
  name: string;
  ticketType: string;
  checkedIn: boolean; // Placeholder
};

export type OrderSample = {
  id: string;
  customerDisplay: string;
  amount: number;
  date: string;
  status: OrderStatus;
};

export type EventOverviewData = {
  eventId: string;
  eventName: string; // Needed for context/layout maybe
  totalRevenue: number;
  ticketsSold: number;
  capacity: number;
  attendeeCheckinRate: number; // Placeholder rate
  ticketTypes: TicketTypeBreakdown[];
  dailyPerformanceData: DailyPerformanceDataPoint[];
  attendeesSample: AttendeeSample[];
  recentOrders: OrderSample[];
};

export const getSingleEventOverviewData = async (
  eventId: string
): Promise<EventOverviewData> => {
  // --- Date Setup ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // Use Prisma transaction for multiple reads potentially benefiting from same snapshot
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch Core Event Data (Throw if not found)
    const event = await tx.events.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        name: true,
        ticketTypes: {
          // For capacity and pie chart
          select: { name: true, quantity: true, quantitySold: true },
        },
        // Count completed orders for revenue/sold tickets (more accurate than counting Tickets if refunds exist)
        orders: {
          where: { status: OrderStatus.COMPLETED },
          select: { total: true, _count: { select: { tickets: true } } },
        },
      },
    });

    if (!event) {
      notFound(); // Trigger Next.js 404 page
    }

    // 2. Fetch Daily Ticket Counts (grouping Tickets)
    const dailySalesGrouped = await tx.tickets.groupBy({
      by: ['createdAt'],
      where: {
        eventId: eventId, // Filter by event
        order: { status: OrderStatus.COMPLETED },
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
      orderBy: { createdAt: 'asc' },
    });

    // 3. Fetch Recent Orders (Sample)
    const recentOrdersRaw = await tx.orders.findMany({
      where: { eventId: eventId, status: OrderStatus.COMPLETED }, // Fetch completed for relevance
      select: {
        id: true,
        name: true, // Customer name on order
        email: true, // Customer email
        total: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // 4. Fetch Recent Attendees (Sample from Tickets)
    // NOTE: This uses ticket data as proxy - Needs 'checkedIn' field on Ticket model for real data
    const recentTicketsRaw = await tx.tickets.findMany({
      where: {
        eventId: eventId,
        order: { status: OrderStatus.COMPLETED },
      },
      select: {
        id: true,
        // Fetch user name/email - requires relation populated correctly
        user: { select: { name: true, email: true } },
        // Fetch ticket type name
        ticketType: { select: { name: true } },
        // No checkedIn field in schema - using placeholder
      },
      orderBy: { createdAt: 'desc' }, // Get most recent tickets
      take: 5,
    });

    return { event, dailySalesGrouped, recentOrdersRaw, recentTicketsRaw };
  }); // End transaction

  // --- Process Results ---
  const { event, dailySalesGrouped, recentOrdersRaw, recentTicketsRaw } =
    result;

  // Calculate Stats
  const totalRevenue = event.orders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const ticketsSold = event.orders.reduce(
    (sum, order) => sum + order._count.tickets,
    0
  );
  const capacity = event.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0);

  // Prepare Pie Chart Data
  // Assign colors consistently - adjust based on number of types
  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];
  const ticketTypesForChart: TicketTypeBreakdown[] = event.ticketTypes
    .map((tt, index) => ({
      name: tt.name,
      // Use quantitySold from TicketType if reliable, otherwise recalculate (more complex)
      sold: tt.quantitySold ?? 0, // Default to 0 if null
      fill: chartColors[index % chartColors.length], // Assign color cyclically
    }))
    .filter((tt) => tt.sold > 0); // Only show types with sales in the chart

  // Process Daily Sales Data (same logic as dashboard, adjusted for tickets)
  const salesMap = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(thirtyDaysAgo.getDate() + i + 1);
    salesMap.set(date.toISOString().split('T')[0], 0);
  }
  dailySalesGrouped.forEach((group) => {
    const dateStr = group.createdAt.toISOString().split('T')[0];
    if (salesMap.has(dateStr)) {
      salesMap.set(dateStr, group._count.id);
    }
  });
  const dailyPerformanceData: DailyPerformanceDataPoint[] = Array.from(
    salesMap.entries()
  )
    .map(([date, tickets]) => ({ date, tickets }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Process Recent Orders
  const recentOrders: OrderSample[] = recentOrdersRaw.map((order) => ({
    id: `#${order.id.substring(0, 6)}`, // Shorten ID for display
    customerDisplay: order.name || order.email || 'N/A',
    amount: order.total,
    date: order.createdAt?.toISOString().split('T')[0] || 'N/A',
    status: order.status,
  }));

  // Process Attendee Sample (Using Ticket Data as Proxy)
  const attendeesSample: AttendeeSample[] = recentTicketsRaw.map((ticket) => ({
    id: ticket.id,
    name: ticket.user?.name || ticket.user?.email || 'Unknown Attendee',
    ticketType: ticket.ticketType?.name || 'N/A',
    checkedIn: false, // *** PLACEHOLDER - No checkedIn field in schema ***
  }));

  // Placeholder Check-in Rate
  const attendeeCheckinRate = 0; // Calculate properly if checkedIn field is added

  return {
    eventId: event.id,
    eventName: event.name,
    totalRevenue,
    ticketsSold,
    capacity,
    attendeeCheckinRate,
    ticketTypes: ticketTypesForChart,
    dailyPerformanceData,
    attendeesSample,
    recentOrders,
  };
};
