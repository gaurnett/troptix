import { getPrismaCreateOrderQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body } = request;

  if (body === undefined || body.order === undefined) {
    return response.status(500).json({ error: 'No body found in POST request' });
  }

  try {
    const event = await prisma.orders.create({
      data: getPrismaCreateOrderQuery(body.order),
      include: {
        tickets: true,
      }
    });

    return response.status(200).json({ error: null, message: "Successfully added order" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding order' });
  }
}