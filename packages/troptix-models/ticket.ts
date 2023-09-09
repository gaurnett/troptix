import { TicketFeeStructure } from './ticketType';
import { TicketType } from "./ticketType";

export class Ticket {
  id: String;
  ticketId: String;
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
    this.maxPurchasePerUser = ticketType.maxPurchasePerUser;
    this.quantitySelected = 0;
  }
}