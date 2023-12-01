import { Prisma } from '@prisma/client';

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