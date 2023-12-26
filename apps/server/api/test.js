import prisma from "../prisma/prisma";

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.RESEND_DYNAMIC_TEMPLATE_API);
export default async function handler(request, response) {

  const ticketId = "ZM385LACCIK0";
  const eventId = "JO7JUGR3LCH9";

  try {
    const ticket = await prisma.tickets.findUnique({
      where: {
        id: ticketId,
        eventId: eventId
      },
    });

    console.log("Ticket: " + JSON.stringify(ticket));
  } catch (error) {
    console.error('Request error', error);
    throw error;
  }

  return response.status(200).json({ message: "Hello World" });
}
