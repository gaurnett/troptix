import { getPrismaCreateStarterEventQuery, getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";
import { sendEmailToUser } from "../lib/emailHelper";
import { updateTicketTypeQuantitySold } from "../lib/orderHelper";

export default async function handler(request, response) {

  return response.status(200).json({ message: "Hello World" });
}
