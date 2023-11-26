import { getPrismaCreateStarterEventQuery, getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";
import { sendEmailToUser } from "../lib/emailHelper";
import { updateTicketTypeQuantitySold } from "../lib/orderHelper";
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.RESEND_DYNAMIC_TEMPLATE_API);
export default async function handler(request, response) {

  const templateData = {
    // id: order.id,
    // eventTitle: order.event.name,
    // orderNumber: String(order.id),
    // orderDate: new Date(order.createdAt).toLocaleDateString(),
    // orders: Array.from(orderMap.values())
  };

  const msg = {
    to: 'flowersgaurnett@gmail.com',
    from: {
      email: 'flowersgaurnett@gmail.com',
      name: 'TropTix',
    },
    subject: 'TropTix Confirmation',
    templateId: 'd-925a204fa5b7431db20d7fe93e8d7ec0',
    dynamicTemplateData: templateData,
  };

  await sgMail.send(msg);

  return response.status(200).json({ message: "Hello World" });
}
