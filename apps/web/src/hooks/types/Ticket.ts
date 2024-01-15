import { generateId } from "@/lib/utils";
import { Checkout, CheckoutTicket } from "./Checkout";

export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE'
}

export enum TicketsType {
  FREE = 'FREE',
  PAID = 'PAID',
  COMPLEMENTARY = 'COMPLEMENTARY'
}

export type Ticket = {
  id?: string;
  ticketTypeId?: string;
  ticketsType?: TicketsType;
  ticketType?: TicketType;
  status?: TicketStatus;
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

export enum TicketFeeStructure {
  // Fees to be included in the ticket price you set.
  // Fees will be deducted from your sales at the time of your payout.
  ABSORB_TICKET_FEES = 'ABSORB_TICKET_FEES',
  // Attendees to pay the fees on top of the ticket price you set.
  // Fees will be collected off the top of your ticket sales at the time of your payout.
  PASS_TICKET_FEES = 'PASS_TICKET_FEES',
}

export type TicketType = {
  id?: string;
  eventId?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Ticket Details
  name?: string;
  description?: string;
  maxPurchasePerUser?: number;
  quantity?: number;
  quantitySold?: number;

  // Sale Date Details
  saleStartDate?: Date;
  saleEndDate?: Date;

  // Price Details
  price?: number;
  ticketingFees?: TicketFeeStructure;
}


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