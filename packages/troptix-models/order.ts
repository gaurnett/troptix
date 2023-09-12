import { CheckoutTicket, Ticket, createTicket } from "./ticket";
import { Event } from "./event";

export class Order {
  id: String;
  eventId: String;
  amount: Number;
  userId: String;
  tickets: Ticket[];

  constructor(checkout: Checkout, paymentId: String, eventId: String, userId: String) {

    this.id = paymentId;
    this.amount = checkout.amount;
    this.tickets = new Array();
    this.userId = userId;
    this.eventId = eventId;

    checkout.tickets.forEach(checkoutTicket => {
      let ticket = createTicket(checkoutTicket, this.id, userId);
      this.tickets.push(ticket);
    })
  }
}

export class Checkout {
  id: String;
  eventId: String;
  amount: Number;
  tickets: CheckoutTicket[];

  constructor(event: Event) {
    this.amount = 0;
    const ticketTypes = event.ticketTypes;
    this.tickets = new Array();

    ticketTypes.forEach(ticketType => {
      let ticket = new CheckoutTicket(ticketType);
      this.tickets.push(ticket);
    });
  }
}