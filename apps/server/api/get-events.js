import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  try {
    const events = await prisma.events.findMany({
      include: {
        tickets: true,
      },
    });
    return response.status(200).json(events);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching posts' });
  }
}