import { Prisma } from '@prisma/client';

export function getPrismaUpdateTicketQuery(ticket) {
  let updatedTicket: Prisma.TicketsUpdateInput;

  updatedTicket = {
    firstName: ticket.firstName,
    lastName: ticket.lastName
  }

  return updatedTicket;
}