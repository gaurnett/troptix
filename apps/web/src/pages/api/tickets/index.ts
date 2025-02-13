import { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors, verifyUser } from '@/server/lib/auth';
import {
  getPrismaUpdateTicketQuery,
  getPrismaUpdateTicketStatusQuery,
  updateScannedTicketStatus,
} from '@/server/lib/ticketHelper';
import prisma from '@/server/prisma';

async function handler(request: VercelRequest, response: VercelResponse) {
  const { body, method } = request;

  if (method === undefined) {
    return response
      .status(500)
      .json({ error: 'No method found for tickets endpoint' });
  }

  if (method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { userId, email } = await verifyUser(request);

  if (!userId) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  switch (method) {
    case 'POST':
      break;
    case 'GET':
      const userId = request.query.userId;
      return await getTicketsForUser(userId, response);
    case 'PUT':
      return await putTicket(body, response);
    case 'DELETE':
      break;
    default:
      break;
  }
}

export default allowCors(handler);

async function putTicket(body, response) {
  switch (body.type) {
    case 'UPDATE_STATUS':
      return updateStatus(body, response);
    case 'UPDATE_NAME':
      return updateName(body, response);
    case 'SCAN_TICKET':
      return scanTicket(body, response);
    default:
      response.status(500).json('No put type set on ticket');
  }
}

async function updateName(body, response) {
  const ticket = body.ticket;

  try {
    const data = await prisma.tickets.update({
      where: {
        id: ticket.id,
      },
      data: getPrismaUpdateTicketQuery(ticket),
    });

    return response.status(200).json(data);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating name' });
  }
}

async function scanTicket(body, response) {
  const id = body.id;
  const eventId = body.eventId;

  try {
    const scannedTicket = await updateScannedTicketStatus(id, eventId);
    return response.status(200).json(scannedTicket);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching user' });
  }
}

async function updateStatus(body, response) {
  const ticket = body.ticket;

  try {
    const data = await prisma.tickets.update({
      where: {
        id: ticket.id,
      },
      data: getPrismaUpdateTicketStatusQuery(ticket),
    });

    return response.status(200).json(data);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating status' });
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
        ticketType: true,
      },
    });
    return response.status(200).json(tickets);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching users' });
  }
}
