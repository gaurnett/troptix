import { PrismaClient, Prisma } from '@prisma/client';

export function getPrismaUpdateDelegatedUserQuery(user, userId) {
  let delegatedUser: Prisma.DelegatedUsersUpdateInput;

  delegatedUser = {
    id: user.id,
    delegatedAccess: user.delegatedAccess,
    userId: userId,
    email: user.email,
    event: {
      connect: {
        id: user.eventId
      }
    }
  }

  return delegatedUser;
}