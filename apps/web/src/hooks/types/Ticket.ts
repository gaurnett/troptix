import { generateId } from "@/lib/utils";
import { Checkout, CheckoutTicket } from "./Checkout";

export type Ticket = {
  id?: string;
  ticketTypeId?: string;
  eventId?: string;
  userId?: string;
  orderId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  description?: string;
  price?: number;
  fees?: number;
  subtotal?: number;
  total?: number;
};

export function createTicket(checkoutTicket: CheckoutTicket, orderId: string, checkout: Checkout): Ticket {
  const ticket: Ticket = {
    id: generateId(),
    eventId: checkoutTicket.eventId,
    orderId: orderId,
    ticketTypeId: checkoutTicket.ticketTypeId,
    userId: checkout.userId,
    fees: checkoutTicket.fees,
    subtotal: checkoutTicket.subtotal,
    total: checkoutTicket.total,
    firstName: checkout.firstName,
    lastName: checkout.lastName,
    email: checkout.email
  };

  return ticket;
}