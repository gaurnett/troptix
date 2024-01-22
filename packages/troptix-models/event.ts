import { generateId } from './idHelper';
import { TicketType } from './ticketType';
import uuid from 'react-native-uuid';

export class Event {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isDraft: boolean;

  // Event Details
  imageUrl: string;
  name: string;
  description: string;
  organizer: string;
  organizerUserId: string;

  // Date and Time Details
  startDate: Date;
  endDate: Date;

  // Location Details
  venue: string;
  address: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;

  // Ticket Details
  ticketTypes: TicketType[];

  constructor(organizerUserId: string = '') {
    this.id = generateId();
    this.organizerUserId = organizerUserId;

    // Start date construction
    this.startDate = new Date();
    this.startDate.setMinutes(0, 0, 0);

    // End date construction
    this.endDate = new Date();
    this.endDate.setHours(this.endDate.getHours() + 4);
    this.endDate.setMinutes(0, 0, 0);

    // Ticket construction
    this.ticketTypes = new Array();
  }
}

export function getEventsFromRequest(e: Object[]): Event[] {
  var events: Event[] = new Array();

  if (e === undefined || e.length === 0) {
    return events;
  }

  e.forEach((event) => {
    let eventObject = Object.assign(new Event(), event);
    events.push(eventObject);
  });

  return events;
}
