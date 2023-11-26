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
    orderTickets.push({
      id: ticket.id,
      eventId: ticket.eventId,
      ticketTypeId: ticket.ticketTypeId,
      fees: ticket.fees,
      subtotal: ticket.subtotal,
      total: ticket.total,
    })
  }

  orderInput = {
    id: order.id,
    stripeCustomerId: order.stripeCustomerId,
    total: order.total,
    fees: order.fees,
    subtotal: order.subtotal,
    name: order.name,
    email: order.email,
    telephoneNumber: order.telephoneNumber,
    billingAddress1: order.billingAddress1,
    billingAddress2: order.billingAddress2,
    billingCity: order.billingCity,
    billingCountry: order.billingCountry,
    billingZip: order.billingZip,
    billingState: order.billingState,
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