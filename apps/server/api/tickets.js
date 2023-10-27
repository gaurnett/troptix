import prisma from "../prisma/prisma";
import { TicketStatus } from '@prisma/client';

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for tickets endpoint' });
  }

  switch (method) {
    case "POST":
      break;
    case "GET":
      const userId = request.query.userId;
      return await getTicketsForUser(userId, response);
    case "PUT":
      return await scanTicket(body, response);
    case "DELETE":
      break;
    default:
      break;
  }
}

async function getTicketsForUser(userId, response) {
  try {
    const tickets = await prisma.tickets.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: true,
        ticketType: true
      }
    });
    return response.status(200).json(tickets);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching users' });
  }
}

async function scanTicket(body, response) {
  const id = body.id;

  try {
    const ticket = await prisma.tickets.findUnique({
      where: {
        id: id,
      },
    });

    if (ticket.status === TicketStatus.NOT_AVAILABLE) {
      return response.status(200).json({
        scan_succeeded: false,
      });
    } else {
      await prisma.tickets.update({
        where: {
          id: id,
        },
        data: {
          status: TicketStatus.NOT_AVAILABLE
        },
      });

      return response.status(200).json({
        scan_succeeded: true,
      });
    }
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching user' });
  }
}