import { CheckoutTicket, Ticket, createTicket } from "./ticket";
import { Event } from "./event";
import uuid from 'react-native-uuid';

export class Order {
  id: string;
  stripePaymentId: string;
  eventId: string;
  total: number;
  subtotal: number;
  fees: number;
  userId: string;
  telephoneNumber: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingZip: string;
  billingState: string;
  billingCountry: string;
  tickets: Ticket[];

  constructor(checkout: Checkout, paymentId: string, eventId: string, userId: string) {

    this.id = paymentId;
    this.total = checkout.total;
    this.subtotal = checkout.subtotal;
    this.fees = checkout.fees
    this.tickets = new Array();
    this.userId = userId;
    this.eventId = eventId;
    this.telephoneNumber = checkout.telephoneNumber;
    this.billingAddress1 = checkout.billingAddress1;
    this.billingAddress2 = checkout.billingAddress2;
    this.billingCity = checkout.billingCity;
    this.billingZip = checkout.billingZip;
    this.billingState = checkout.billingState;
    this.billingCountry = checkout.billingCountry;

    checkout.tickets.forEach(checkoutTicket => {
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
  tickets: CheckoutTicket[];

  constructor(event: Event) {
    const ticketTypes = event.ticketTypes;
    this.tickets = new Array();

    ticketTypes.forEach(ticketType => {
      let ticket = new CheckoutTicket(ticketType);
      this.tickets.push(ticket);
    });
  }
}

export class Charge {
  total: number = 0;
  userId: string = "";

  constructor() { }
}