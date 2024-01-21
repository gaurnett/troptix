import uuid from 'react-native-uuid';
import { TicketFeeStructure } from './ticketType';
import { TicketType } from './ticketType';
import { generateId } from './idHelper';

export function createTicket(
  checkoutTicket: CheckoutTicket,
  orderId: string,
  userId: string
) {
  const ticket = {} as Ticket;

  ticket.id = generateId();
  ticket.eventId = checkoutTicket.eventId;
  ticket.orderId = orderId;
  ticket.ticketTypeId = checkoutTicket.ticketTypeId;
  ticket.userId = userId;
  ticket.fees = checkoutTicket.fees;
  ticket.subtotal = checkoutTicket.subtotal;
  ticket.total = checkoutTicket.total;

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
  subtotal: number;
  total: number;
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
  fees: number;
  subtotal: number;
  total: number;

  constructor(ticketType: TicketType) {
    this.name = ticketType.name;
    this.description = ticketType.description;
    this.eventId = ticketType.eventId;
    this.ticketTypeId = ticketType.id;
    this.quantitySelected = 0;
    this.fees = 0;
    this.subtotal = 0;
    this.total = 0;
  }
}
