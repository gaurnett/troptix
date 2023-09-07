import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  try {
    const user = await prisma.star.create({
      data: {
        name: 'Alice',
        constellation: 'alice@prisma.io',
      },
    });
    console.log(user);
    return response.status(200).json({ error: null, message: "Successfully added star" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching posts' });
  }
}