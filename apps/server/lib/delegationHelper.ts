import { PrismaClient, Prisma } from '@prisma/client';

export function getPrismaCreateDelegatedUserQuery(user) {
  let delegatedUser: Prisma.DelegatedUsersCreateInput;

  delegatedUser = {
    delegatedAccess: user.delegatedAccess,
    email: user.email,
    events: {
      connect: {
        id: user.eventId
      }
    }
  }

  return delegatedUser;
}