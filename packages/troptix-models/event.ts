import { TicketType } from "./ticketType";
import uuid from 'react-native-uuid';

export class Event {
  id: String;
  createdAt: Date;
  updatedAt: Date;

  // Event Details
  imageUrl: String;
  name: String;
  description: String;
  organizer: String;

  // Date and Time Details
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;

  // Location Details
  address: String;
  country: String;

  // Ticket Details
  ticketTypes: TicketType[];

  constructor() {
    this.id = String(uuid.v4());
    this.organizer = "Sunnation";
    this.country = "Jamaica";
    this.imageUrl = "https://assets.fete.land/vibes/styles/full/s3/event/image/202303/fetelist-sunrise-breakfast-party-jamaica-carnival-2023.jpg";

    // Start date construction
    this.startDate = new Date();
    this.startTime = new Date();
    this.startTime.setMinutes(0);

    // End date construction
    this.endDate = new Date();
    this.endDate.setHours(this.endDate.getHours() + 4);
    this.endTime = this.endDate;
    this.endTime.setMinutes(0);

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
  })

  return events;
}
