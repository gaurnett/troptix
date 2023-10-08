import prisma from "../prisma/prisma";
import { TicketStatus } from '@prisma/client';

export default async function handler(request, response) {
  const { body } = request;
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