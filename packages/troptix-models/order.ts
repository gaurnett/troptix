import { CheckoutTicket, Ticket, createTicket } from "./ticket";
import { Event } from "./event";

export class Order {
  id: string;
  eventId: string;
  total: number;
  subtotal: number;
  fees: number;
  userId: string;
  tickets: Ticket[];

  constructor(checkout: Checkout, paymentId: string, eventId: string, userId: string) {

    this.id = paymentId;
    this.total = checkout.total;
    this.subtotal = checkout.subtotal;
    this.fees = checkout.fees
    this.tickets = new Array();
    this.userId = userId;
    this.eventId = eventId;

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
  tickets: CheckoutTicket[];

  constructor(event: Event) {
    this.total = 0;
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