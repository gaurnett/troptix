import { DelegatedAccess, OrderStatus, Prisma, PrismaClient, TicketStatus, TicketType } from '@prisma/client';
import prisma from "../prisma/prisma";
import { adminUserIds } from './experimentHelper';

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
          gte: new Date()
        }
      }
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
          in: adminUserIds
        }
      },
      startDate: {
        gte: new Date()
      }
    }
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
      event: true
    },
    where: {
      userId: userId,
      OR: [
        { delegatedAccess: DelegatedAccess.OWNER },
        { delegatedAccess: DelegatedAccess.TICKET_SCANNER }
      ]
    },
  });

  let scannedEvents = [];
  if (scannableEvents.length !== 0) {
    scannableEvents.forEach(scannableEvent => {
      scannedEvents.push(scannableEvent.event);
    });
  }

  return organizedEvents.concat(scannedEvents);
}

export async function getEventsByOrganizerIdQuery(userId: string) {
  console.log(userId);

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
      event: true
    },
    where: {
      userId: userId,
      delegatedAccess: DelegatedAccess.OWNER
    },
  });

  let ownerEvents = [];
  if (ownedEvents.length !== 0) {
    ownedEvents.forEach(event => {
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
        id: ticket.eventId
      }
    }
  }

  return ticketInput
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
  }

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
  }

  return eventInput;
}

export function getPrismaCreateOrderQuery(order) {
  let orderInput: Prisma.OrdersCreateInput;
  let orderTickets: Prisma.TicketsCreateManyOrderInput[] = [];

  for (const ticket of order.tickets) {
    let ticketInput: Prisma.TicketsCreateManyOrderInput = {
      id: ticket.id,
      eventId: ticket.eventId,
      ticketTypeId: ticket.ticketTypeId,
      status: TicketStatus.NOT_AVAILABLE,
      ticketsType: TicketType.PAID,
      fees: ticket.fees,
      subtotal: ticket.subtotal,
      total: ticket.total,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
    }

    if (order.userId) {
      ticketInput = {
        ...ticketInput,
        userId: order.userId
      }
    }

    orderTickets.push(ticketInput);
  }

  orderInput = {
    id: order.id,
    stripePaymentId: order.stripePaymentId,
    stripeCustomerId: order.stripeCustomerId,
    total: order.total,
    fees: order.fees,
    subtotal: order.subtotal,
    name: order.name,
    firstName: order.firstName,
    lastName: order.lastName,
    email: order.email,
    telephoneNumber: order.telephoneNumber,
    billingAddress1: order.billingAddress1,
    billingAddress2: order.billingAddress2,
    billingCity: order.billingCity,
    billingCountry: order.billingCountry,
    billingZip: order.billingZip,
    billingState: order.billingState,
    ticketsLink: order.ticketsLink,
    event: {
      connect: {
        id: order.eventId
      }
    },
    tickets: {
      createMany: {
        data: orderTickets,
      },
    },
  }

  if (order.userId !== undefined) {
    orderInput = {
      ...orderInput,
      user: {
        connect: {
          id: order.userId
        }
      },
    }
  }

  return orderInput;
}

export function getPrismaCreateComplementaryOrderQuery(order) {
  let orderInput: Prisma.OrdersCreateInput;
  let orderTickets: Prisma.TicketsCreateManyOrderInput[] = [];

  for (const ticket of order.tickets) {
    orderTickets.push({
      id: ticket.id,
      eventId: order.eventId,
      ticketTypeId: ticket.ticketTypeId,
      status: TicketStatus.AVAILABLE,
      ticketsType: TicketType.COMPLEMENTARY,
      total: 0,
      fees: 0,
      subtotal: 0,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email
    })
  }

  orderInput = {
    id: order.id,
    status: OrderStatus.COMPLETED,
    total: 0,
    subtotal: 0,
    fees: 0,
    firstName: order.firstName,
    lastName: order.lastName,
    ticketsLink: order.ticketsLink,
    email: order.email,
    event: {
      connect: {
        id: order.eventId
      }
    },
    tickets: {
      createMany: {
        data: orderTickets,
      },
    },
  }

  if (order.userId !== undefined) {
    orderInput = {
      ...orderInput,
      user: {
        connect: {
          id: order.userId
        }
      },
    }
  }

  return orderInput;
}