import prisma from '@/server/prisma';
import { verifyEventAccess, isPlatformOwner } from '@/server/accessControl';
import { notFound } from 'next/navigation';

// Extended event data for platform admins
export type PlatformEventData = {
  id: string;
  name: string;
  startDate: Date;
  startTime: Date | null;
  endDate: Date;
  venue: string | null;
  description: string | null;
  imageUrl: string | null;
  isDraft: boolean;
  status: 'Active' | 'Upcoming' | 'Past' | 'Draft';
  createdAt: Date;
  // Owner information
  organizer: {
    id: string;
    name: string | null;
    email: string | null;
  };
  // Basic stats
  stats: {
    totalOrders: number;
    totalRevenue: number;
    ticketsSold: number;
  };
};

export async function getAllPlatformEvents(
  userId: string,
  userEmail?: string
): Promise<PlatformEventData[]> {
  // Verify user has platform access
  if (!isPlatformOwner(userEmail)) {
    notFound();
  }

  // Fetch all events with organizer info and basic stats
  const eventsRaw = await prisma.events.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
      startTime: true,
      endDate: true,
      venue: true,
      description: true,
      imageUrl: true,
      isDraft: true,
      createdAt: true,
      organizerUserId: true,
      orders: {
        where: { status: 'COMPLETED' },
        select: {
          total: true,
          _count: { select: { tickets: true } },
        },
      },
    },
    orderBy: [
      { isDraft: 'asc' }, // Non-drafts first
      { startDate: 'desc' },
    ],
  });

  // Get organizer information for all unique organizer IDs
  const organizerIds = Array.from(
    new Set(eventsRaw.map((event) => event.organizerUserId))
  );
  const organizers = await prisma.users.findMany({
    where: { id: { in: organizerIds } },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  // Create organizer lookup map
  const organizerMap = new Map(organizers.map((org) => [org.id, org]));

  // Process events with status calculation and stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const processedEvents: PlatformEventData[] = eventsRaw.map((event) => {
    // Calculate status
    let status: PlatformEventData['status'];
    if (event.isDraft) {
      status = 'Draft';
    } else if (new Date(event.endDate) < today) {
      status = 'Past';
    } else if (new Date(event.startDate) <= today) {
      status = 'Active';
    } else {
      status = 'Upcoming';
    }

    // Calculate stats
    const totalRevenue = event.orders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const ticketsSold = event.orders.reduce(
      (sum, order) => sum + order._count.tickets,
      0
    );

    // Get organizer info
    const organizer = organizerMap.get(event.organizerUserId) || {
      id: event.organizerUserId,
      name: 'Unknown User',
      email: null,
    };

    return {
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      startTime: event.startTime,
      endDate: event.endDate,
      venue: event.venue,
      description: event.description,
      imageUrl: event.imageUrl,
      isDraft: event.isDraft,
      status,
      createdAt: event.createdAt,
      organizer: {
        id: organizer.id,
        name: organizer.name,
        email: organizer.email,
      },
      stats: {
        totalOrders: event.orders.length,
        totalRevenue,
        ticketsSold,
      },
    };
  });

  return processedEvents;
}
