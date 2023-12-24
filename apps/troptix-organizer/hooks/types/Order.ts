import { generateId } from "../../lib/utils";
import { Checkout, CheckoutTicket } from "./Checkout";
import { createTicket } from "./Ticket";

type Ticket = {
  // Define the properties of the Ticket type here
};

export type Order = {
  id?: string;
  stripeCustomerId?: string;
  stripePaymentId?: string;
  eventId?: string;
  total?: number;
  subtotal?: number;
  fees?: number;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  telephoneNumber?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity?: string;
  billingZip?: string;
  billingState?: string;
  billingCountry?: string;
  tickets?: Ticket[];
  ticketsLink?: string;
};

export function createOrder(checkout: Checkout, paymentId: string, stripeCustomerId: string, userId: string): Order {
  const id = generateId();
  const tickets: Ticket[] = [];
  const url = window.location.origin + `/tickets?orderId=${id}`;

  Array.from(checkout.tickets.keys()).forEach(checkoutItem => {
    const checkoutTicket = checkout.tickets.get(checkoutItem);
    const quantity = checkoutTicket?.quantitySelected as number;
    if (quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        let ticket = createTicket(checkoutTicket as CheckoutTicket, id, checkout);
        tickets.push(ticket);
      }
    }
  })

  let order: Order = {
    id: id,
    stripeCustomerId: stripeCustomerId,
    stripePaymentId: paymentId,
    total: checkout.total,
    subtotal: checkout.subtotal,
    fees: checkout.fees,
    tickets: tickets,
    ticketsLink: url,
    userId: userId,
    firstName: checkout.firstName,
    lastName: checkout.lastName,
    email: checkout.email,
    eventId: checkout.eventId,
    telephoneNumber: checkout.telephoneNumber,
    billingAddress1: checkout.billingAddress1,
    billingAddress2: checkout.billingAddress2,
    billingCity: checkout.billingCity,
    billingCountry: checkout.billingCountry,
    billingState: checkout.billingState,
    billingZip: checkout.billingZip
  }

  return order;
}

export type ComplementaryOrder = {
  id?: string;
  eventId?: string;
  eventName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  total?: number;
  ticketsLink?: string;
  tickets?: ComplementaryTicket[];
}

export function generateComplementaryOrder(event): ComplementaryOrder {
  const id = generateId();
  const url = window.location.origin + `/tickets?orderId=${id}`;

  const order: ComplementaryOrder = {
    id: id,
    eventId: event.id,
    eventName: event.name,
    total: 0,
    ticketsLink: url,
    tickets: []
  }

  return order;
}

export type ComplementaryTicket = {
  id?: string;
  ticketTypeId?: string;
  name: string; // Name of ticket type
  eventId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export type TicketSummary = {
  name?: string;
  quantity?: number;
  quantitySold?: number;
  ticketId?: string;
}

export type OrderSummary = {
  gross?: number;
  fees?: number;
  ticketsSummary?: Map<string, TicketSummary>;
  summary?: TicketSummary[];
}

export function generateOrderSummary(orders: any[]): OrderSummary {
  const orderSummary: OrderSummary = {
    gross: 0,
    fees: 0,
    ticketsSummary: new Map<string, TicketSummary>(),
    summary: []
  }

  for (const order of orders) {
    orderSummary.gross += order.subtotal;
    orderSummary.fees = order.fees;

    for (const ticket of order.tickets) {
      const ticketName = ticket.ticketsType === "COMPLEMENTARY" ? "Complementary" : ticket.ticketType.name;
      const ticketId = ticket.ticketsType === "COMPLEMENTARY" ? "Complementary" : ticket.ticketType.id;
      const quantity = ticket.ticketsType === "COMPLEMENTARY" ? 0 : ticket.ticketType.quantity;

      if (orderSummary.ticketsSummary.has(ticketId)) {
        let summary = orderSummary.ticketsSummary.get(ticketId);
        if (summary && summary.quantitySold) {
          summary.quantitySold += 1;
          orderSummary.ticketsSummary.set(ticketId, summary);
        }
      } else {
        let summary: TicketSummary = {
          name: ticketName,
          quantity: quantity,
          quantitySold: 1
        }

        orderSummary.ticketsSummary.set(ticketId, summary);
      }
    }
  }

  orderSummary.summary = Array.from(orderSummary.ticketsSummary.values());

  return orderSummary;
}