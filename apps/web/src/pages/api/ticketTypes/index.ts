import { OrderStatus, PrismaClient } from '@prisma/client';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors } from '@/server/lib/auth';
import {
  getPrismaCreateTicketTypeQuery,
  getPrismaTicketTypeQuery,
} from '@/server/lib/eventHelper';
import prisma from '@/server/prisma';

const prismaClient = prisma as PrismaClient;

async function handler(request: VercelRequest, response: VercelResponse) {
  const { body, method } = request;

  if (method === undefined) {
    return response
      .status(500)
      .json({ error: 'No method found for ticket types endpoint' });
  }

  switch (method) {
    case 'POST':
      return await createTicket(body, response);
    case 'GET':
      return await getTicketTypes(request, response);
    case 'PUT':
      return await updateTicket(body, response);
    case 'DELETE':
      break;
    case 'OPTIONS':
      return response.status(200).end();
    default:
      console.log(method);
      break;
  }
}

export default handler;

async function getTicketTypes(
  request: VercelRequest,
  response: VercelResponse
) {
  const getTicketTypesType = request.query.getTicketTypesType;

  switch (String(getTicketTypesType)) {
    case 'GET_TICKET_TYPES_BY_EVENT':
      return getTicketTypesByEvent(request, response);
    case 'GET_TICKET_TYPES_FOR_CHECKOUT':
      return getTicketTypesForCheckout(request, response);
    default:
      return response.status(500).json({ error: 'No ticket type set' });
  }
}

async function getTicketTypesForCheckout(
  request: VercelRequest,
  response: VercelResponse
) {
  const eventId = request.query.eventId as string;

  // await prismaClient.orders.updateMany({
  //   where: {
  //     eventId: eventId,
  //     status: OrderStatus.PENDING,
  //     // cardLast4: '4242'
  //   },
  //   data: {
  //     status: OrderStatus.CANCELLED
  //   }
  // })

  try {
    const ticketTypes = await prismaClient.ticketTypes.findMany({
      where: {
        eventId: eventId,
      },
      orderBy: {
        price: 'asc',
      },
    });

    const orders = await prismaClient.orders.findMany({
      where: {
        eventId: eventId,
        OR: [
          {
            status: OrderStatus.COMPLETED,
          },
          {
            status: OrderStatus.PENDING,
          },
        ],
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          },
        },
      },
    });

    const ticketMap = new Map<string, Map<OrderStatus, number>>();
    orders.forEach((order) => {
      order.tickets.forEach((ticket) => {
        const ticketType = ticket.ticketType;
        const ticketTypeId = ticketType?.id as string;

        if (ticketMap.has(ticketTypeId)) {
          const currentTicketMap = ticketMap.get(ticketTypeId) as Map<
            OrderStatus,
            number
          >;

          if (currentTicketMap?.has(order.status)) {
            const statusCount = currentTicketMap.get(order.status) as number;
            currentTicketMap.set(order.status, statusCount + 1);
            ticketMap.set(ticketTypeId, currentTicketMap);
          } else {
            currentTicketMap.set(order.status, 1);
            ticketMap.set(ticketTypeId, currentTicketMap);
          }
        } else {
          const map = new Map<OrderStatus, number>();
          map.set(order.status, 1);
          ticketMap.set(ticketTypeId, map);
        }
      });
    });

    const ticketTypesWithOrderStatus = ticketTypes.map((ticketType) => {
      const orderStatusMap = ticketMap.get(ticketType.id);

      return {
        ...ticketType,
        pendingOrders: orderStatusMap?.get(OrderStatus.PENDING) ?? 0,
        completedOrders: orderStatusMap?.get(OrderStatus.COMPLETED) ?? 0,
      };
    });

    console.log(ticketTypesWithOrderStatus);
    return response.status(200).json(ticketTypesWithOrderStatus);
  } catch (error) {
    console.error('Request error', error);
    return response.status(500).json({ error: 'Error fetching ticket types' });
  }
}

async function getTicketTypesByEvent(request, response) {
  const eventId = request.query.eventId;

  try {
    const ticketTypes = await prisma.ticketTypes.findMany({
      where: {
        eventId: eventId,
      },
    });
    return response.status(200).json(ticketTypes);
  } catch (e) {
    console.error('Request error', e);
    return response
      .status(500)
      .json({ error: 'Error fetching promotion by code' });
  }
}

async function createTicket(body, response) {
  if (body === undefined || body.ticketType === undefined) {
    return response.status(500).json({ error: 'No body found in PUT request' });
  }

  const ticketType = body.ticketType;

  try {
    await prismaClient.ticketTypes.create({
      data: getPrismaCreateTicketTypeQuery(ticketType),
    });

    return response
      .status(200)
      .json({ error: null, message: 'Successfully updated event and tickets' });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating event' });
  }
}

async function updateTicket(body, response) {
  if (body === undefined || body.ticketType === undefined) {
    return response.status(500).json({ error: 'No body found in PUT request' });
  }

  const ticketType = body.ticketType;

  try {
    await prisma.ticketTypes.upsert({
      where: {
        id: ticketType.id,
      },
      update: getPrismaTicketTypeQuery(ticketType),
      create: getPrismaTicketTypeQuery(ticketType),
    });

    return response
      .status(200)
      .json({ error: null, message: 'Successfully updated event and tickets' });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating event' });
  }
}
