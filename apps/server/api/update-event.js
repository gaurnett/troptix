import { getPrismaTicketTypeQuery, getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body } = request;

  if (body === undefined || body.event === undefined) {
    return response.status(500).json({ error: 'No body found in POST request' });
  }

  try {
    await prisma.events.update({
      where: {
        id: body.event.id,
      },
      data: getPrismaUpdateEventQuery(body.event),
    });

    let ticketTypes = body.event.ticketTypes;
    for (const ticketType of ticketTypes) {
      await prisma.ticketTypes.upsert({
        where: {
          id: ticketType.id,
        },
        update: getPrismaTicketTypeQuery(ticketType),
        create: getPrismaTicketTypeQuery(ticketType),
      });
    }

    return response.status(200).json({ error: null, message: "Successfully updated event and tickets" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating event' });
  }
}