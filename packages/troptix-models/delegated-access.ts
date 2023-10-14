export enum DelegatedAccess {
  OWNER = 'OWNER',
  TICKET_SCANNER = 'TICKET_SCANNER',
}

export class DelegatedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  email: String;
  userId: String;
  eventId: String;
  delegatedAccess: DelegatedAccess;
}