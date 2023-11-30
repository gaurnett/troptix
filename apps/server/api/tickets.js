import { TicketStatus } from '@prisma/client';
import { getPrismaUpdateTicketQuery } from '../lib/ticketHelper';
import prisma from "../prisma/prisma";

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
      return await putTicket(body, response);
    case "DELETE":
      break;
    case "OPTIONS":
      return response.status(200).end();
    default:
      break;
  }
}

async function putTicket(body, response) {
  switch (body.type) {
    case "SCAN_TICKET":
      return scanTicket(body, response);
    case "UPDATE_NAME":
      return updateName(body, response);
    default:
      response.status(500).json('No put type set on ticket');
  }
}

async function updateName(body, response) {
  const ticket = body.ticket;

  try {
    await prisma.tickets.update({
      where: {
        id: ticket.id,
      },
      data: getPrismaUpdateTicketQuery(ticket),
    });

    return response.status(200).json({
      message: "Successfully updated ticket",
    });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching user' });
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

