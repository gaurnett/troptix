import { PrismaClient, OrderStatus } from '@prisma/client';

export const invalidateOrders = async (minutes: number) => {
  const prisma = new PrismaClient();

  const currentTime = new Date();
  const cutoffTime = new Date(currentTime.getTime() - minutes * 60000);

  const { count } = await prisma.orders.updateMany({
    where: {
      status: OrderStatus.PENDING,
      createdAt: {
        lt: cutoffTime,
      },
    },
    data: {
      status: OrderStatus.CANCELLED,
    },
  });

  return count;
};
