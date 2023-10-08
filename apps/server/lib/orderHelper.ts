import { buffer } from 'micro';
import { PrismaClient, Prisma, OrderStatus, TicketStatus } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function getBuffer(request) {
  const buf = await buffer(request);
  return buf;
}

export function updateSuccessfulOrder() {
  let orderUpdate: Prisma.OrdersUpdateInput;

  orderUpdate = {
    status: OrderStatus.COMPLETED,
    tickets: {
      updateMany: {
        where: {
          status: TicketStatus.NOT_AVAILABLE
        },
        data: {
          status: TicketStatus.AVAILABLE
        }
      }
    }
  }


  return orderUpdate;
}