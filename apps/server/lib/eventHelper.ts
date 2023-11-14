import { PrismaClient, Prisma } from '@prisma/client';

export function getPrismaTicketTypeQuery(ticket) {
  let ticketInput: Prisma.TicketTypesUpdateInput;
  ticketInput = {
    id: ticket.id,
    name: ticket.name,
    description: ticket.description,
    maxPurchasePerUser: ticket.maxPurchasePerUser,
    quantity: ticket.quantity,
    saleStartDate: ticket.saleStartDate,
    saleStartTime: ticket.saleStartTime,
    saleEndDate: ticket.saleEndDate,
    saleEndTime: ticket.saleEndTime,
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
    name: event.name,
    description: event.description,
    summary: event.summary,
    organizer: event.organizer,
    organizerUserId: event.organizerUserId,
    endDate: event.endDate,
    endTime: event.endTime,
    startDate: event.startDate,
    startTime: event.startTime,
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
    endTime: event.endTime,
    startDate: event.startDate,
    startTime: event.startTime,
    venue: event.venue,
    address: event.address,
    countryCode: event.country_code,
    latitude: event.latitude,
    longitude: event.longitude,
    country: event.country,
  }

  return eventInput;
}

export function getPrismaCreateEventQuery(event) {
  let eventInput: Prisma.EventsCreateInput;
  let ticketTypes: Prisma.TicketTypesCreateManyEventInput[] = [];

  for (const ticketType of event.ticketTypes) {
    ticketTypes.push({
      name: ticketType.name,
      description: ticketType.description,
      maxPurchasePerUser: ticketType.maxPurchasePerUser,
      quantity: ticketType.quantity,
      saleStartDate: ticketType.saleStartDate,
      saleStartTime: ticketType.saleStartTime,
      saleEndDate: ticketType.saleEndDate,
      saleEndTime: ticketType.saleEndTime,
      price: ticketType.price
    })
  }

  eventInput = {
    id: event.id,
    imageUrl: event.imageUrl,
    name: event.name,
    description: event.description,
    summary: event.summary,
    organizer: event.organizer,
    organizerUserId: event.organizerUserId,
    endDate: event.endDate,
    endTime: event.endTime,
    startDate: event.startDate,
    startTime: event.startTime,
    venue: event.venue,
    address: event.address,
    countryCode: event.country_code,
    latitude: event.latitude,
    longitude: event.longitude,
    country: event.country,
    ticketTypes: {
      createMany: {
        data: ticketTypes
      }
    }
  }

  return eventInput;
}

export function getPrismaCreateOrderQuery(order) {
  let orderInput: Prisma.OrdersCreateInput;
  let orderTickets: Prisma.TicketsCreateManyOrderInput[] = [];

  for (const ticket of order.tickets) {
    orderTickets.push({
      id: ticket.id,
      eventId: ticket.eventId,
      ticketTypeId: ticket.ticketTypeId,
      userId: ticket.userId
    })
  }

  orderInput = {
    id: order.id,
    total: order.total,
    fees: order.fees,
    subtotal: order.subtotal,
    user: {
      connect: {
        id: order.userId
      }
    },
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

  return orderInput;
}