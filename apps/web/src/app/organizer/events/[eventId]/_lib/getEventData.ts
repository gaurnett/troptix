import { OrderStatus, Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import prisma from '@/server/prisma';

type TicketTypeBreakdown = {
  name: string;
  sold: number;
  fill: string;
};

type DailyPerformanceDataPoint = {
  date: string;
  revenue: number;
};

type AttendeeSample = {
  id: string;
  name: string;
  ticketType: string;
  checkedIn: boolean; // Not supported yet, could use the ticket statusfield in tickets table
};

type OrderSample = {
  id: string;
  customerDisplay: string;
  amount: number;
  date: string;
  status: OrderStatus;
};

type EventOverviewData = {
  eventId: string;
  eventName: string;
  isDraft: boolean;
  eventCreatedAt: Date;
  eventUpdatedAt: Date;
  totalRevenue: number;
  ticketsSold: number;
  capacity: number;
  attendeeCheckinRate: number;
  ticketTypes: TicketTypeBreakdown[];
  dailyPerformanceData: DailyPerformanceDataPoint[];
  attendeesSample: AttendeeSample[];
  recentOrders: OrderSample[];
  startTime: Date | null;
  startDate: Date;
  venueName: string | null;
  venueAddress: string;
};

export const getSingleEventOverviewData = async (
  eventId: string
): Promise<EventOverviewData> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const result = await prisma.$transaction(async (tx) => {
    // Fetch Event Data
    const event = await tx.events.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        name: true,
        isDraft: true,
        createdAt: true,
        updatedAt: true,
        startTime: true,
        startDate: true,
        venue: true,
        address: true,
        ticketTypes: {
          select: { name: true, quantity: true, quantitySold: true },
        },
        orders: {
          where: { status: OrderStatus.COMPLETED },
          select: { total: true, _count: { select: { tickets: true } } },
        },
      },
    });

    if (!event) {
      notFound();
    }

    //Fetch Daily REVENUE
    const dailyRevenueGrouped = await tx.orders.groupBy({
      by: ['createdAt'],
      where: {
        eventId: eventId,
        status: OrderStatus.COMPLETED,
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: {
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Fetch Recent Orders
    const recentOrdersRaw = await tx.orders.findMany({
      where: { eventId: eventId },
      select: {
        id: true,
        name: true,
        email: true,
        total: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Fetch Recent Attendees maybe remove this
    const recentTicketsRaw = await tx.tickets.findMany({
      where: {
        eventId: eventId,
        order: { status: OrderStatus.COMPLETED },
      },
      select: {
        id: true,
        user: { select: { name: true, email: true } },
        ticketType: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return { event, dailyRevenueGrouped, recentOrdersRaw, recentTicketsRaw };
  });

  const { event, dailyRevenueGrouped, recentOrdersRaw, recentTicketsRaw } =
    result;

  const totalRevenue = event.orders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const ticketsSold = event.orders.reduce(
    (sum, order) => sum + (order._count?.tickets ?? 0),
    0
  );
  const capacity = event.ticketTypes.reduce(
    (sum, tt) => sum + (tt.quantity ?? 0),
    0
  );

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
      sold: tt.quantitySold ?? 0,
      fill: chartColors[index % chartColors.length],
    }))
    .filter((tt) => tt.sold > 0);

  // Process data to be used for the daily revenue chart
  const revenueMap = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(thirtyDaysAgo.getDate() + i); // Corrected date iteration
    const dateStr = date.toISOString().split('T')[0];
    revenueMap.set(dateStr, 0);
  }

  dailyRevenueGrouped.forEach((group) => {
    if (group.createdAt) {
      const dateStr = group.createdAt.toISOString().split('T')[0];
      if (revenueMap.has(dateStr)) {
        revenueMap.set(
          dateStr,
          (revenueMap.get(dateStr) || 0) + (group._sum.total || 0)
        );
      }
    }
  });

  const dailyPerformanceData: DailyPerformanceDataPoint[] = Array.from(
    revenueMap.entries()
  )
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ensure sorted by date

  const recentOrders: OrderSample[] = recentOrdersRaw.map((order) => ({
    id: `#${order.id.substring(0, 6)}`,
    customerDisplay: order.name || order.email || 'N/A',
    amount: order.total,
    date: order.createdAt?.toISOString().split('T')[0] || 'N/A', // Format date as YYYY-MM-DD
    status: order.status,
  }));

  const attendeesSample: AttendeeSample[] = recentTicketsRaw.map((ticket) => ({
    id: ticket.id,
    name: ticket.user?.name || ticket.user?.email || 'Unknown Attendee',
    ticketType: ticket.ticketType?.name || 'N/A',
    checkedIn: false, // *** PLACEHOLDER - No checkedIn field in schema ***
  }));

  // Placeholder Check-in Rate
  const attendeeCheckinRate = 0;

  return {
    eventId: event.id,
    eventName: event.name,
    isDraft: event.isDraft,
    eventCreatedAt: event.createdAt,
    eventUpdatedAt: event.updatedAt,
    startTime: event.startTime,
    startDate: event.startDate,
    venueName: event.venue,
    venueAddress: event.address,
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
