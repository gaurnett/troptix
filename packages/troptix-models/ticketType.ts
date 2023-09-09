import { Event } from "./event";
import uuid from 'react-native-uuid';

export enum TicketFeeStructure {
  // Fees to be included in the ticket price you set.
  // Fees will be deducted from your sales at the time of your payout.
  ABSORB_TICKET_FEES = 'ABSORB_TICKET_FEES',
  // Attendees to pay the fees on top of the ticket price you set.
  // Fees will be collected off the top of your ticket sales at the time of your payout.
  PASS_TICKET_FEES = 'PASS_TICKET_FEES',
}

export class TicketType {
  id: String;
  eventId: String;
  createdAt: Date;
  updatedAt: Date;

  // Ticket Details
  name: String;
  description: String;
  maxPurchasePerUser: Number;
  quantity: Number;

  // Sale Date Details
  saleStartDate: Date;
  saleStartTime: Date;
  saleEndDate: Date;
  saleEndTime: Date;

  // Price Details
  price: Number;
  ticketingFees: TicketFeeStructure;

  constructor(event: Event) {
    this.id = String(uuid.v4());
    this.eventId = event.id;

    // Start date construction
    this.saleStartDate = new Date();
    this.saleStartTime = new Date();
    this.saleStartTime.setMinutes(0);

    // End date construction
    this.saleEndDate = new Date();
    this.saleEndDate.setHours(this.saleEndDate.getHours() + 4);
    this.saleEndTime = this.saleEndDate;
    this.saleEndTime.setMinutes(0);

    this.ticketingFees = TicketFeeStructure.PASS_TICKET_FEES;
  }
}
