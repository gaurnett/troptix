import { getPrismaCreateDelegatedUserQuery } from "../lib/delegationHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body } = request;

  if (body === undefined || body.user === undefined) {
    return response.status(500).json({ error: 'No body found in POST request' });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        email: body.user.email,
      },
    });

    if (user === null || user === undefined) {
      return response.status(404).json({ error: 'User email not found' });
    }

    await prisma.delegatedUsers.create({
      data: getPrismaCreateDelegatedUserQuery(body.user),
    });

    return response.status(200).json({ error: null, message: "Successfully added user" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding user' });
  }
}