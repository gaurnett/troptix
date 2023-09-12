import { PrismaClient, Prisma } from '@prisma/client';

export function getPrismaTicketTypeQuery(ticket) {
  return {
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
    eventId: ticket.eventId,
  };
}

export function getPrismaUpdateEventQuery(event) {
  return {
    address: event.address,
    description: event.description,
    endDate: event.endDate,
    endTime: event.endTime,
    id: event.id,
    imageUrl: event.imageUrl,
    name: event.name,
    organizer: event.organizer,
    startDate: event.startDate,
    startTime: event.startTime,
  };
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
    organizer: event.organizer,
    endDate: event.endDate,
    endTime: event.endTime,
    startDate: event.startDate,
    startTime: event.startTime,
    address: event.address,
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
    amount: order.amount,
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
  // return {
  //   id: order.id,
  //   amount: order.amount,
  //   userId: order.userId,
  //   eventId: order.eventId,
  //   tickets: {
  //     createMany: {
  //       data: order.tickets,
  //     },
  //   },
  // };
}