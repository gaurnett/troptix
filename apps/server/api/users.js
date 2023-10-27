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
      break;
    case "DELETE":
      break;
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
      data: body.user,
    });
    return response.status(200).json({ error: null, message: "Successfully added user" });
  } catch (e) {
    return response.status(500).json({ error: 'Error adding user' });
  }
}

async function getUsers(getUserType, id, response) {
  switch (Number(getUserType)) {
    case 0: // GetUsersType.GET_USERS_BY_ID
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
    });
    return response.status(200).json(user);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching user' });
  }
}