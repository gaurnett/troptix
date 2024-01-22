import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../prisma/prisma.js';

const prismaClient = prisma as PrismaClient;

export function getPrismaUpdateDelegatedUserQuery(user, userId) {
  let delegatedUser: Prisma.DelegatedUsersUpdateInput;

  delegatedUser = {
    id: user.id,
    delegatedAccess: user.delegatedAccess,
    userId: userId,
    email: user.email,
    event: {
      connect: {
        id: user.eventId,
      },
    },
  };

  return delegatedUser;
}

export async function deleteDelegatedUserQuery(userId: string) {
  try {
    const deletedUser = await prismaClient.delegatedUsers.delete({
      where: {
        id: userId,
      },
    });
    return deletedUser;
  } catch (error) {
    console.log(error);
  }
}
