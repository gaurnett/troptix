import uuid from 'react-native-uuid';

export enum DelegatedAccess {
  OWNER = 'OWNER',
  TICKET_SCANNER = 'TICKET_SCANNER',
}

export class DelegatedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  email: string;
  eventId: string;
  delegatedAccess: DelegatedAccess;

  constructor(eventId: string) {
    this.id = String(uuid.v4());
    this.eventId = eventId
  }
}