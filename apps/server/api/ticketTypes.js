import prisma from "../prisma/prisma";
import { getPrismaTicketTypeQuery } from "../lib/eventHelper";

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for ticket types endpoint' });
  }

  switch (method) {
    case "POST":
      return await updateTicket(body, response);
    case "GET":
      return await getTicketTypes(request, response);
    case "PUT":
      return await updateTicket(body, response);
    case "DELETE":
      break;
    case "OPTIONS":
      return response.status(200).end();
    default:
      console.log(method);
      break;
  }
}

async function getTicketTypes(request, response) {
  const getTicketTypesType = request.query.getTicketTypesType;

  switch (String(getTicketTypesType)) {
    case 'GET_TICKET_TYPES_BY_EVENT':
      return getTicketTypesByEvent(request, response);
    default:
      return response.status(500).json({ error: 'No ticket type set' });
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
    return response.status(500).json({ error: 'Error fetching promotion by code' });
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

    return response.status(200).json({ error: null, message: "Successfully updated event and tickets" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating event' });
  }
}

async function scanTicket() { }