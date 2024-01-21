import uuid from 'react-native-uuid';
import { generateId } from './idHelper';

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
    this.id = generateId();
    this.eventId = eventId;
  }
}
