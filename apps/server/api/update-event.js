import { getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body } = request;

  if (body === undefined || body.event === undefined) {
    return response.status(500).json({ error: 'No body found in POST request' });
  }

  try {
    const user = await prisma.events.update({
      where: {
        id: body.event.id,
      },
      data: getPrismaUpdateEventQuery(body.event),
    });

    if (body.event.tickets !== undefined) {
      let tickets = body.event.tickets;
      tickets.forEach(async (ticket) => {
        const user = await prisma.ticket.update({
          where: {
            id: ticket.id,
          },
          data: ticket,
        });
      });
    }

    return response.status(200).json({ error: null, message: "Successfully added event" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error posting event' });
  }
}