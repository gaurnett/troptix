import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body } = request;

  if (body === undefined || body.user === undefined) {
    return response.status(500).json({ error: 'No body found in POST request' });
  }

  try {
    const user = await prisma.users.create({
      data: body.user,
    });
    return response.status(200).json({ error: null, message: "Successfully added user" });
  } catch (e) {
    return response.status(500).json({ error: 'Error adding user' });
  }
}