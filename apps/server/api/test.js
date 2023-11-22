import { getPrismaCreateStarterEventQuery, getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";
import { sendEmailToUser } from "../lib/emailHelper";

export default async function handler(request, response) {
  const order = await prisma.orders.findUnique({
    where: {
      id: 'pi_3OEdQOFEd6UvxBWG1RA0OvMQ',
    },
    include: {
      tickets: {
        include: {
          ticketType: true,
        }
      },
      event: true,
      user: true,
    },
  });

  const email = await sendEmailToUser(order, response);
}
