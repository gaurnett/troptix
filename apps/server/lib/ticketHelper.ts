import { Prisma, PrismaClient } from '@prisma/client';
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

export function getPrismaUpdateTicketUserQuery(userId) {
  let updatedTicket: Prisma.TicketsUpdateInput;

  updatedTicket = {
    user: {
      connect: {
        id: userId
      }
    },
  }

  return updatedTicket;
}