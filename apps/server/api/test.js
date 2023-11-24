import { getPrismaCreateStarterEventQuery, getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";
import { sendEmailToUser } from "../lib/emailHelper";

export default async function handler(request, response) {
  const order = {
    total: 155,
    userId: undefined
  };

  const email = await sendEmailToUser(order, response);
}
