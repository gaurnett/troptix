import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  try {
    const stars = await prisma.star.findMany();
    return response.status(200).json(stars);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching posts' });
  }
}