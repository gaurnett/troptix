import { getPrismaCreateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body } = request;

  if (body === undefined || body.event === undefined) {
    return response.status(500).json({ error: 'No body found in POST request' });
  }

  try {
    const event = await prisma.events.create({
      data: getPrismaCreateEventQuery(body.event),
      include: {
        ticketTypes: true,
      }
    });

    return response.status(200).json({ error: null, message: "Successfully added event" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding event' });
  }
}