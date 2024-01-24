import {
  OrderStatus,
  Prisma,
  TicketStatus,
  TicketType
} from '@prisma/client';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function getBuffer(request) {
  const buf = await buffer(request);
  return buf;
}

export function updateSuccessfulOrder(paymentMethod) {
  let orderUpdate: Prisma.OrdersUpdateInput;

  orderUpdate = {
    status: OrderStatus.COMPLETED,
    cardType: paymentMethod.card.brand,
    cardLast4: paymentMethod.card.last4,
    tickets: {
      updateMany: {
        where: {
          status: TicketStatus.NOT_AVAILABLE,
        },
        data: {
          status: TicketStatus.AVAILABLE,
        },
      },
    },
  };

  return orderUpdate;
}

export function updateTicketTypeQuantitySold(quantitySold) {
  let ticketTypeUpdate: Prisma.TicketTypesUpdateInput;

  ticketTypeUpdate = {
    quantitySold: {
      increment: quantitySold,
    },
    pendingOrders: {
      decrement: quantitySold
    }
  };

  return ticketTypeUpdate;
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
    };

    if (order.userId) {
      ticketInput = {
        ...ticketInput,
        userId: order.userId,
      };
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
        id: order.eventId,
      },
    },
    tickets: {
      createMany: {
        data: orderTickets,
      },
    },
  };

  if (order.userId !== undefined) {
    orderInput = {
      ...orderInput,
      user: {
        connect: {
          id: order.userId,
        },
      },
    };
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
      email: order.email,
    });
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
        id: order.eventId,
      },
    },
    tickets: {
      createMany: {
        data: orderTickets,
      },
    },
  };

  if (order.userId !== undefined) {
    orderInput = {
      ...orderInput,
      user: {
        connect: {
          id: order.userId,
        },
      },
    };
  }

  return orderInput;
}
