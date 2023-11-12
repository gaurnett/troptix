import prisma from "../prisma/prisma";
import { getPrismaUpdateDelegatedUserQuery } from "../lib/delegationHelper";

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for delegated users endpoint' });
  }

  switch (method) {
    case "POST":
      return await updateDelegatedUser(body, response);
    case "GET":
      const eventId = request.query.eventId;
      return await getDelegatedUsers(eventId, response);
    case "PUT":
      return await updateDelegatedUser(body, response);
    case "DELETE":
      break;
    case "OPTIONS":
      return response.status(200).end();
    default:
      break;
  }
}

async function getDelegatedUsers(eventId, response) {
  try {
    const users = await prisma.delegatedUsers.findMany({
      where: {
        eventId: eventId,
      },
    });
    return response.status(200).json(users);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching delegated users' });
  }
}

async function updateDelegatedUser(body, response) {

  if (body === undefined) {
    return response.status(500).json({ error: 'No body found in PUT request' });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        email: body.email,
      },
    });

    if (user === null || user === undefined) {
      return response.status(404).json({ error: 'User email not found' });
    }

    await prisma.delegatedUsers.upsert({
      where: {
        id: body.id,
      },
      update: getPrismaUpdateDelegatedUserQuery(body, user.id),
      create: getPrismaUpdateDelegatedUserQuery(body, user.id),
    });

    return response.status(200).json({ error: null, message: "Successfully updated delegated user" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating delegated user' });
  }
}
