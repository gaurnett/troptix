import { Ticket } from "./ticket";
import { Event } from "./event";

export class Order {
  id: String;
  eventId: String;
  totalPrice: Number;
  tickets: Ticket[];

  constructor(event: Event) {
    this.totalPrice = 0;
    const ticketTypes = event.tickets;
    this.tickets = new Array();
    ticketTypes.forEach(ticketType => {
      let ticket = new Ticket(ticketType);
      this.tickets.push(ticket);
    });
  }
}