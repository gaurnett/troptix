import { Prisma, PrismaClient, TicketStatus } from '@prisma/client';
import prisma from "../prisma/prisma";

const prismaClient = prisma as PrismaClient;

export function getPrismaUpdateTicketQuery(ticket) {
  let updatedTicket: Prisma.TicketsUpdateInput;

  updatedTicket = {
    firstName: ticket.firstName,
    lastName: ticket.lastName
  }

  return updatedTicket;
}

export function getPrismaUpdateTicketStatusQuery(ticket) {
  let updatedTicket: Prisma.TicketsUpdateInput;

  updatedTicket = {
    status: ticket.status,
  }

  return updatedTicket;
}

export async function updateScannedTicketStatus(ticketId: string) {
  try {
    const ticket = await prismaClient.tickets.findUnique({
      where: {
        id: ticketId,
      },
    });

    const ticketType = await prismaClient.ticketTypes.findUnique({
      where: {
        id: ticket.ticketTypeId,
      },
    });

    if (ticket.status === TicketStatus.NOT_AVAILABLE) {
      return {
        ticketName: ticketType.name,
        ticketDescription: ticketType.description,
        scanSucceeded: false,
      };
    } else {
      await prisma.tickets.update({
        where: {
          id: ticketId,
        },
        data: {
          status: TicketStatus.NOT_AVAILABLE
        },
      });

      return {
        ticketName: ticketType.name,
        ticketDescription: ticketType.description,
        scanSucceeded: true,
      };
    }
  } catch (e) {
    console.error('Request error', e);
    throw e;
  }
}