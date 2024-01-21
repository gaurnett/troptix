import { buffer } from 'micro';
import {
  PrismaClient,
  Prisma,
  OrderStatus,
  TicketStatus,
} from '@prisma/client';

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
  };

  return ticketTypeUpdate;
}
