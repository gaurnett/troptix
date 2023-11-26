import { CheckoutTicket, Ticket, createTicket } from "./ticket";
import { Event } from "./event";
import { generateId } from "./idHelper";

export class Order {
  id: string;
  stripePaymentId: string;
  stripeCustomerId: string;
  eventId: string;
  total: number;
  subtotal: number;
  fees: number;
  userId: string;
  name: string;
  email: string;
  telephoneNumber: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingZip: string;
  billingState: string;
  billingCountry: string;
  tickets: Ticket[];

  constructor(checkout: Checkout, paymentId: string, eventId: string, userId: string, stripeCustomerId: string) {

    this.id = generateId();
    this.stripeCustomerId = stripeCustomerId;
    this.stripePaymentId = paymentId;
    this.total = checkout.total;
    this.subtotal = checkout.subtotal;
    this.fees = checkout.fees
    this.tickets = new Array();
    this.userId = userId;
    this.name = checkout.name;
    this.email = checkout.email;
    this.eventId = eventId;
    this.telephoneNumber = checkout.telephoneNumber;
    this.billingAddress1 = checkout.billingAddress1;
    this.billingAddress2 = checkout.billingAddress2;
    this.billingCity = checkout.billingCity;
    this.billingZip = checkout.billingZip;
    this.billingState = checkout.billingState;
    this.billingCountry = checkout.billingCountry;

    Array.from(checkout.tickets.keys()).forEach(checkoutItem => {
      const checkoutTicket = checkout.tickets.get(checkoutItem);
      if (checkoutTicket.quantitySelected > 0) {
        for (let i = 0; i < checkoutTicket.quantitySelected; i++) {
          let ticket = createTicket(checkoutTicket, this.id, userId);
          this.tickets.push(ticket);
        }
      }
    })
  }
}

class TicketSummary {
  name: string;
  quantity: number;
  quantitySold: number;
}

export class OrderSummary {
  gross: number = 0;
  fees: number = 0
  ticketsSummary = new Map<string, TicketSummary>();

  constructor(orders) {
    for (const order of orders) {
      this.gross += order.subtotal;
      this.fees = order.fees;

      for (const ticket of order.tickets) {
        const ticketId = ticket.ticketTypeId;
        if (this.ticketsSummary.has(ticketId)) {
          let summary = this.ticketsSummary.get(ticketId);
          if (summary && summary.quantitySold) {
            summary.quantitySold += 1;
            this.ticketsSummary.set(ticketId, summary);
          }
        } else {
          let summary: TicketSummary = {
            name: ticket.ticketType.name,
            quantity: ticket.ticketType.quantity,
            quantitySold: 1
          }

          this.ticketsSummary.set(ticketId, summary);
        }
      }
    }
  }
}

export class Checkout {
  id: string;
  eventId: string;
  name: string;
  email: string;
  total: number = 0;
  subtotal: number = 0;
  fees: number = 0;
  discountedSubtotal: number = 0;
  discountedTotal: number = 0;
  discountedFees: number = 0;
  promotionApplied: boolean = false;
  telephoneNumber: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingZip: string;
  billingState: string;
  billingCountry: string;
  tickets: Map<string, CheckoutTicket> = new Map();

  constructor(user: any) {
    this.name = user?.name;
    this.email = user?.email;
  }
}

export class ComplementaryOrder {
  id: string;
  eventId: string;
  eventName: string;
  name: string;
  email: string;
  total: number = 0;
  tickets: ComplementaryTicket[] = [];

  constructor(event) {
    this.id = generateId();
    this.eventId = event.id;
    this.eventName = event.name;
  }
}

export class ComplementaryTicket {
  id: string;
  ticketTypeId: string;
  eventId: string;
  name: string;

  constructor() {
    this.id = generateId();
  }
}

export class Charge {
  total: number = 0;
  userId: string = "";

  constructor() { }
}