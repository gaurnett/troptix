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
      break;
    case "PUT":
      return await updateTicket(body, response);
    case "DELETE":
      break;
    default:
      break;
  }
}

async function updateTicket(body, response) {

  if (body === undefined || body.ticketType === undefined) {
    return response.status(500).json({ error: 'No body found in PUT request' });
  }

  const ticketType = body.ticketType;

  try {
    // await prisma.ticketTypes.update({
    //   where: {
    //     id: body.ticketType.id,
    //   },
    //   data: getPrismaTicketTypeQuery(body.ticketType),
    // });

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