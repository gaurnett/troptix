import { PrismaClient } from '@prisma/client';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors } from '@/server/lib/auth';
import { sendComplementaryTicketEmailToUser } from '@/server/lib/emailHelper';
import {
  getPrismaCreateComplementaryOrderQuery,
  getPrismaCreateOrderQuery,
} from '@/server/lib/orderHelper';
import prisma from '@/server/prisma';

const prismaClient = prisma as PrismaClient;

type TicketOrders = {
  quantity?: number;
  quantitySold?: number;
  pendingOrders?: number;
  ticket?: any;
};

async function handler(request: VercelRequest, response: VercelResponse) {
  const { body, method } = request;

  if (method === undefined) {
    return response
      .status(500)
      .json({ error: 'No method found for users endpoint' });
  }

  if (method === 'OPTIONS') {
    return response.status(200).end();
  }

  switch (method) {
    case 'POST':
      return postOrders(request, response);
    case 'GET':
      return getOrders(request, response);
    case 'PUT':
      break;
    case 'DELETE':
      break;
    default:
      break;
  }
}

export default allowCors(handler);

async function postOrders(request, response) {
  const { body, headers } = request;

  if (body === undefined || body.type === undefined) {
    return response
      .status(500)
      .json({ error: 'No body found in post orders request' });
  }

  const postOrderType = body.type;

  switch (String(postOrderType)) {
    case 'POST_ORDERS_CREATE_ORDER':
      return createOrder(body, response);
    case 'POST_ORDERS_CREATE_COMPLEMENTARY_ORDER':
      return createComplementaryOrder(body, response);
    default:
      return response.status(500).json({ error: 'No post order type set' });
  }
}

async function createOrder(body, response) {
  const order = body.order;

  if (order === undefined) {
    return response
      .status(500)
      .json({ error: 'No order found in create order request' });
  }

  try {
    const event = await prisma.orders.create({
      data: getPrismaCreateOrderQuery(order),
      include: {
        tickets: true,
      },
    });

    return response
      .status(200)
      .json({ error: null, message: 'Successfully added order' });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding order' });
  }
}

async function createComplementaryOrder(body, response) {
  const order = body.complementaryOrder;

  if (order === undefined) {
    return response
      .status(500)
      .json({ error: 'No order found in create complementary order request' });
  }

  try {
    const prismaOrder = await prisma.orders.create({
      data: getPrismaCreateComplementaryOrderQuery(order),
      include: {
        tickets: true,
      },
    });

    const orderMap = new Map();
    order.tickets.forEach((ticket) => {
      const ticketId = ticket.id;
      if (orderMap.has(ticketId)) {
        const order = orderMap.get(ticketId);
        orderMap.set(ticketId, {
          ...order,
          ticketQuantity: order.ticketQuantity + 1,
        });
      } else {
        orderMap.set(ticketId, {
          ticketQuantity: 1,
          ticketName: ticket.name,
          ticketTotalPaid: order.total,
        });
      }
    });

    const mailResponse = await sendComplementaryTicketEmailToUser(
      order,
      orderMap
    );

    return response.status(200).json(prismaOrder);
  } catch (e) {
    console.error('Request error', e);
    return response
      .status(500)
      .json({ error: 'Error adding complementary order' });
  }
}

async function getOrders(request, response) {
  const getOrderType = request.query.getOrdersType;

  switch (String(getOrderType)) {
    case 'GET_ORDERS_FOR_USER': // GetOrdersType.GET_ORDERS_FOR_USER
      const userEmail = request.query.email;
      return getOrdersForUser(response, userEmail);
    case 'GET_ORDER_BY_ID': // GetOrdersType.GET_ORDER_BY_ID
      const orderId = request.query.id;
      return getOrderById(response, orderId);
    case 'GET_ORDERS_FOR_EVENT': // GetOrdersType.GET_ORDERS_FOR_EVENT
      const eventId = request.query.id;
      return getOrdersForEvent(response, eventId);
    case 'GET_PENDING_ORDERS_FOR_EVENT': // GetOrdersType.GET_ORDERS_FOR_EVENT
      return getPendingOrdersForEvent(request, response);
    default:
      return response.status(500).json({ error: 'No get order type set' });
  }
}

async function getOrdersForUser(response, userEmail) {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        email: userEmail,
        status: 'COMPLETED',
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          },
        },
        event: true,
      },
    });
    return response.status(200).json(orders);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function getOrderById(response, orderId) {
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          },
        },
        event: true,
      },
    });
    return response.status(200).json(order);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function getOrdersForEvent(response, eventId) {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        eventId: eventId,
        status: 'COMPLETED',
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          },
        },
        event: true,
        user: true,
      },
    });
    return response.status(200).json(orders);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function getPendingOrdersForEvent(
  request: VercelRequest,
  response: VercelResponse
) {
  const eventId = request.query.id as string;

  try {
    const orders = await prismaClient.orders.findMany({
      where: {
        eventId: eventId,
        status: 'PENDING',
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          },
        },
      },
    });

    const pendingOrdersMap = new Map<string, TicketOrders>();
    orders.forEach((order) => {
      order.tickets.forEach((ticket) => {
        const ticketType = ticket.ticketType;
        const ticketTypeId = ticketType?.id as string;
        if (pendingOrdersMap.has(ticketTypeId)) {
          const currentOrder = pendingOrdersMap.get(ticketTypeId);
          pendingOrdersMap.set(ticketTypeId, {
            ...currentOrder,
            pendingOrders: (currentOrder?.pendingOrders as number) + 1,
          });
        } else {
          pendingOrdersMap.set(ticketTypeId, {
            quantity: ticketType?.quantity,
            quantitySold: ticketType?.quantitySold as number,
            pendingOrders: 1,
            ticket: ticket,
          });
        }
      });
    });

    return response.status(200).json(Array.from(pendingOrdersMap));
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}
