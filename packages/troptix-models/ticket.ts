import uuid from 'react-native-uuid';
import { TicketFeeStructure } from './ticketType';
import { TicketType } from "./ticketType";

export function createTicket(checkoutTicket: CheckoutTicket, orderId: string, userId: string) {
  const ticket = {} as Ticket;

  ticket.id = String(uuid.v4());
  ticket.eventId = checkoutTicket.eventId;
  ticket.orderId = orderId;
  ticket.ticketTypeId = checkoutTicket.ticketTypeId;
  ticket.userId = userId;

  return ticket;
}

export interface Ticket {
  id: string;
  ticketTypeId: string;
  eventId: string;
  userId: string;
  orderId?: string;
  name: string;
  description: string;
  price: number;
  fees: number;
}

export interface TicketSummary {
  id: string;
  status: any;
  orderId: string;
  ticketType: any;
}

export interface TicketsSummary {
  event: any;
  tickets: TicketSummary[];
}

export class CheckoutTicket {
  id: string;
  ticketTypeId: string;
  eventId: string;
  name: string;
  description: string;
  quantitySelected: number;
  price: number;
  maxPurchasePerUser: number;
  ticketFees: TicketFeeStructure;

  constructor(ticketType: TicketType) {
    this.name = ticketType.name;
    this.description = ticketType.description;
    this.price = ticketType.price;
    this.ticketFees = ticketType.ticketingFees;
    this.eventId = ticketType.eventId;
    this.ticketTypeId = ticketType.id;
    this.maxPurchasePerUser = ticketType.maxPurchasePerUser;
    this.quantitySelected = 0;
  }
}