import { verifyUser } from "../lib/auth";
import { sendComplementaryTicketEmailToUser } from "../lib/emailHelper";
import { getPrismaCreateComplementaryOrderQuery, getPrismaCreateOrderQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for users endpoint' });
  }

  const userId = await verifyUser(request);

  if (!userId) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  console.log(userId);

  switch (method) {
    case "POST":
      return postOrders(request, response);
    case "GET":
      const getOrderType = request.query.getOrdersType;
      const id = request.query.id;
      return getOrders(getOrderType, userId, id, response);
    case "PUT":
      break;
    case "DELETE":
      break;
    case "OPTIONS":
      return response.status(200).end();
    default:
      break;
  }
}

async function postOrders(request, response) {
  const { body, headers } = request;

  if (body === undefined || body.type === undefined) {
    return response.status(500).json({ error: 'No body found in post orders request' });
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
    return response.status(500).json({ error: 'No order found in create order request' });
  }

  try {
    const event = await prisma.orders.create({
      data: getPrismaCreateOrderQuery(order),
      include: {
        tickets: true,
      }
    });

    return response.status(200).json({ error: null, message: "Successfully added order" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding order' });
  }

}

async function createComplementaryOrder(body, response) {
  const order = body.complementaryOrder;

  if (order === undefined) {
    return response.status(500).json({ error: 'No order found in create complementary order request' });
  }

  try {
    const prismaOrder = await prisma.orders.create({
      data: getPrismaCreateComplementaryOrderQuery(order),
      include: {
        tickets: true,
      }
    });

    const orderMap = new Map();
    order.tickets.forEach(ticket => {
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
          ticketTotalPaid: order.total
        });
      }
    });

    console.log(orderMap);

    const mailResponse = await sendComplementaryTicketEmailToUser(order, orderMap);

    console.log("Added complementary order: " + order.id);

    return response.status(200).json(prismaOrder);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding complementary order' });
  }

}

async function getOrders(getOrderType, userId, id, response) {
  switch (String(getOrderType)) {
    case 'GET_ORDERS_FOR_USER': // GetOrdersType.GET_ORDERS_FOR_USER
      return getOrdersForUser(response, userId);
    case 'GET_ORDER_BY_ID': // GetOrdersType.GET_ORDER_BY_ID
      return getOrderById(response, userId, id);
    case 'GET_ORDERS_FOR_EVENT': // GetOrdersType.GET_ORDERS_FOR_EVENT
      return getOrdersForEvent(response, id);
    default:
      return response.status(500).json({ error: 'No get order type set' });
  }
}

async function getOrdersForUser(response, userId) {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        userId: userId,
        status: 'COMPLETED'
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          }
        },
        event: true
      },
    });
    return response.status(200).json(orders);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function getOrderById(response, userId, orderId) {
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
        userId: userId,
        status: 'COMPLETED'
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          }
        },
        event: true
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
        status: 'COMPLETED'
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          }
        },
        event: true,
        user: true
      },
    });
    return response.status(200).json(orders);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}
