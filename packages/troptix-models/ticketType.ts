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
  id: string;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;

  // Ticket Details
  name: string = "";
  description: string = "";
  maxPurchasePerUser: number = 0;
  quantity: number = 0;
  quantitySold: number = 0;

  // Sale Date Details
  saleStartDate: Date;
  saleStartTime: Date;
  saleEndDate: Date;
  saleEndTime: Date;

  // Price Details
  price: number = 0;
  ticketingFees: TicketFeeStructure;

  constructor(eventId: string) {
    this.id = String(uuid.v4());
    this.eventId = eventId;

    // Start date construction
    this.saleStartDate = new Date();
    this.saleStartDate.setHours(0, 0, 0, 0);
    this.saleStartTime = new Date();
    this.saleStartTime.setMinutes(0);

    // End date construction
    this.saleEndDate = new Date();
    this.saleEndDate.setHours(this.saleEndDate.getHours() + 4);
    this.saleEndTime = new Date(this.saleEndDate);
    this.saleEndDate.setHours(0, 0, 0, 0);
    this.saleEndTime.setMinutes(0);

    this.ticketingFees = TicketFeeStructure.PASS_TICKET_FEES;
  }
}
