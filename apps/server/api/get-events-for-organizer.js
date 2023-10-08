import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const id = request.query.id;

  try {
    const user = await prisma.events.findMany({
      where: {
        organizerUserId: id,
      },
      include: {
        ticketTypes: true,
      },
    });
    return response.status(200).json(user);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}