import { allowCors, verifyUser } from "../lib/auth";
import { deleteDelegatedUserQuery, getPrismaUpdateDelegatedUserQuery } from "../lib/delegationHelper";
import prisma from "../prisma/prisma";

async function handler(request, response) {
  const { body, method } = request;

  if (!method) {
    return response.status(500).json({ error: 'No method found for delegated users endpoint' });
  }

  const { userId, email } = await verifyUser(request);

  if (!userId) {
    return response.status(401).json({ error: "Unauthorized" });
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
      const id = body.id;
      return await deleteDelegatedUser(id, response);
    case "OPTIONS":
      return response.status(200).end();
    default:
      break;
  }
}

module.exports = allowCors(handler);

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

    if (!user) {
      return response.status(404).json({ error: 'User email not found' });
    }

    const insertedUser = await prisma.delegatedUsers.upsert({
      where: {
        id: body.id,
      },
      update: getPrismaUpdateDelegatedUserQuery(body, user.id),
      create: getPrismaUpdateDelegatedUserQuery(body, user.id),
    });

    return response.status(200).json(insertedUser);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating delegated user' });
  }
}

async function deleteDelegatedUser(userId, response) {
  if (!userId) {
    return response.status(500).json({ error: 'No userId found in DELETE request' });
  }

  try {
    const deletedUser = await deleteDelegatedUserQuery(userId);
    return response.status(200).json(deletedUser);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating delegated user' });
  }
}
