import uuid from 'react-native-uuid';
import { TicketFeeStructure } from './ticketType';
import { TicketType } from "./ticketType";

export function createTicket(checkoutTicket: CheckoutTicket, orderId: String, userId: String) {
  const ticket = {} as Ticket;

  ticket.id = String(uuid.v4());
  ticket.eventId = checkoutTicket.eventId;
  ticket.orderId = orderId;
  ticket.ticketTypeId = checkoutTicket.ticketTypeId;
  ticket.userId = userId;

  return ticket;
}

export interface Ticket {
  id: String;
  ticketTypeId: String;
  eventId: String;
  userId: String;
  orderId?: String;
  name: String;
  description: String;
  price: Number;
  fees: Number;
}

export class CheckoutTicket {
  id: String;
  ticketTypeId: String;
  eventId: String;
  name: String;
  description: String;
  quantitySelected: Number;
  price: Number;
  maxPurchasePerUser: Number;
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