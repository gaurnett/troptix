import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const id = request.query.id;
  try {
    const user = await prisma.orders.findMany({
      where: {
        eventId: id,
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          }
        },
        event: true,
        user: true
      },
    });
    return response.status(200).json(user);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}