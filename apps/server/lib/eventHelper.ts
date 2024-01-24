import {
  DelegatedAccess,
  Prisma,
  PrismaClient
} from '@prisma/client';
import prisma from '../prisma/prisma.js';
import { adminUserIds } from './experimentHelper.js';

const prismaClient = prisma as PrismaClient;

export async function getAllEventsQuery(userId: string) {
  if (adminUserIds.includes(userId)) {
    return prismaClient.events.findMany({
      include: {
        ticketTypes: true,
      },
      where: {
        isDraft: false,
        startDate: {
          gte: new Date(),
        },
      },
    });
  }

  return prismaClient.events.findMany({
    include: {
      ticketTypes: true,
    },
    where: {
      isDraft: false,
      NOT: {
        organizerUserId: {
          in: adminUserIds,
        },
      },
      startDate: {
        gte: new Date(),
      },
    },
  });
}

export async function getEventsScannableByOrganizerIdQuery(userId: string) {
  const organizedEvents = await prismaClient.events.findMany({
    where: {
      organizerUserId: userId,
    },
  });

  const scannableEvents = await prismaClient.delegatedUsers.findMany({
    select: {
      event: true,
    },
    where: {
      userId: userId,
      OR: [
        { delegatedAccess: DelegatedAccess.OWNER },
        { delegatedAccess: DelegatedAccess.TICKET_SCANNER },
      ],
    },
  });

  let scannedEvents: any = [];
  if (scannableEvents.length !== 0) {
    scannableEvents.forEach((scannableEvent) => {
      scannedEvents.push(scannableEvent.event);
    });
  }

  return organizedEvents.concat(scannedEvents);
}

export async function getEventsByOrganizerIdQuery(userId: string) {
  const events = await prismaClient.events.findMany({
    where: {
      organizerUserId: userId,
    },
    include: {
      ticketTypes: true,
    },
  });

  const ownedEvents = await prismaClient.delegatedUsers.findMany({
    select: {
      event: true,
    },
    where: {
      userId: userId,
      delegatedAccess: DelegatedAccess.OWNER,
    },
  });

  let ownerEvents: any = [];
  if (ownedEvents.length !== 0) {
    ownedEvents.forEach((event) => {
      ownerEvents.push(event.event);
    });
  }

  return events.concat(ownerEvents);
}

export async function getEventByIdQuery(id: string) {
  return prismaClient.events.findUnique({
    where: {
      id: id,
    },
    include: {
      ticketTypes: true,
    },
  });
}

export function getPrismaTicketTypeQuery(ticket) {
  let ticketInput: Prisma.TicketTypesUpdateInput;
  ticketInput = {
    id: ticket.id,
    name: ticket.name,
    description: ticket.description,
    maxPurchasePerUser: ticket.maxPurchasePerUser,
    quantity: ticket.quantity,
    saleStartDate: ticket.saleStartDate,
    saleEndDate: ticket.saleEndDate,
    price: ticket.price,
    ticketingFees: ticket.ticketingFees,
    event: {
      connect: {
        id: ticket.eventId,
      },
    },
  };

  return ticketInput;
}

export function getPrismaUpdateEventQuery(event) {
  let eventInput: Prisma.EventsUpdateInput;
  eventInput = {
    imageUrl: event.imageUrl,
    isDraft: event.isDraft,
    name: event.name,
    description: event.description,
    summary: event.summary,
    organizer: event.organizer,
    organizerUserId: event.organizerUserId,
    endDate: event.endDate,
    startDate: event.startDate,
    venue: event.venue,
    address: event.address,
    countryCode: event.country_code,
    latitude: event.latitude,
    longitude: event.longitude,
    country: event.country,
  };

  return eventInput;
}

export function getPrismaCreateStarterEventQuery(event) {
  let eventInput: Prisma.EventsCreateInput;

  eventInput = {
    id: event.id,
    name: event.name,
    description: event.description,
    organizer: event.organizer,
    organizerUserId: event.organizerUserId,
    endDate: event.endDate,
    startDate: event.startDate,
    venue: event.venue,
    address: event.address,
    countryCode: event.country_code,
    latitude: event.latitude,
    longitude: event.longitude,
    country: event.country,
  };

  return eventInput;
}
