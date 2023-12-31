import { getPrismaCreateUserQuery, getPrismaUpdateSocialMediaQuery, getPrismaUpdateUserQuery } from "../lib/userHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for events endpoint' });
  }

  switch (method) {
    case "POST":
      return addUser(body, response);
    case "GET":
      const getUserType = request.query.getUsersType;
      const id = request.query.id;
      return getUsers(getUserType, id, response);
    case "PUT":
      return putUsers(body, response);
    case "DELETE":
      break;
    case "OPTIONS":
      return response.status(200).end();
    default:
      break;
  }
}

async function addUser(body, response) {
  if (body === undefined || body.user === undefined) {
    return response.status(500).json({ error: 'No body found in User POST request' });
  }

  try {
    const user = await prisma.users.create({
      data: getPrismaCreateUserQuery(body.user),
    });

    if (user) {
      const updatedTickets = await prisma.tickets.update({
      });
    }
    return response.status(200).json({ error: null, message: "Successfully added user" });
  } catch (e) {
    return response.status(500).json({ error: 'Error adding user' });
  }
}

async function getUsers(getUserType, id, response) {
  switch (getUserType) {
    case 'GET_USERS_BY_ID':
      return getUserById(id, response);
    default:
      return response.status(500).json({ error: 'No get user type set' });
  }
}

async function getUserById(id, response) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
      include: {
        socialMediaAccounts: true,
      },
    });
    return response.status(200).json(user);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching user' });
  }
}

async function putUsers(body, response) {
  const putUsersType = body.putUsersType;
  switch (putUsersType) {
    case 'PUT_USERS_USER_DETAILS':
      return putUserDetails(body, response);
    case 'PUT_USERS_SOCIAL_MEDIA':
      return putUserSocialMedia(body, response);
    default:
      return response.status(500).json({ error: 'No get user type set' });
  }
}

async function putUserDetails(body, response) {

  if (body === undefined || body.user === undefined) {
    return response.status(500).json({ error: 'No body found in user PUT request' });
  }

  const user = body.user;

  try {
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: getPrismaUpdateUserQuery(user),
    });

    return response.status(200).json({ error: null, message: "Successfully updated user" });
  } catch (e) {
    return response.status(500).json({ error: 'Error updating user: ' + JSON.stringify(e) });
  }

}

async function putUserSocialMedia(body, response) {

  if (body === undefined || body.socialMediaAccount === undefined) {
    return response.status(500).json({ error: 'No body found in social media PUT request' });
  }

  const account = body.socialMediaAccount;

  try {
    await prisma.socialMediaAccounts.upsert({
      where: {
        id: account.id,
      },
      update: getPrismaUpdateSocialMediaQuery(account),
      create: getPrismaUpdateSocialMediaQuery(account),
    });

    return response.status(200).json({ error: null, message: "Successfully updated social media" });
  } catch (e) {
    return response.status(500).json({ error: 'Error updating social media: ' + JSON.stringify(e) });
  }

}