import { generateId } from '@/lib/utils';

export enum DelegatedAccess {
  OWNER = 'OWNER',
  TICKET_SCANNER = 'TICKET_SCANNER',
}

export type DelegatedUser = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  email?: string;
  eventId?: string;
  delegatedAccess?: DelegatedAccess;
};

export function createUser(eventId: string): DelegatedUser {
  const id = generateId();
  let user: DelegatedUser = {
    id: id,
    eventId: eventId,
  };

  return user;
}
