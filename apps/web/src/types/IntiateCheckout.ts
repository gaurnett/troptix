export enum ValidationResponseMessage {
  SomeTicketsUnavailable = 'Some tickets were unavailable or sold out and cart was adjusted',
  AllTicketsValidated = 'All tickets are valid',
  AllTicketInvalid = 'All tickets are invalid',
  NoTicketsSelected = 'No tickets selected',
  MissingRequiredFields = 'Missing required fields or no tickets selected',
}

export interface ValidationResponse {
  isValid: boolean;
  wasAdjusted: boolean;
  validatedItems: ValidatedItem[];
  subtotal: number;
  fees: number;
  total: number;
  promotionApplied: string | null;
  message: ValidationResponseMessage | null;
  isFree: boolean;
  orderId: string | null;
  clientSecret: string | null;
  expiresAt: string | null;
}

export enum ValidatedItemMessage {
  Available = 'Available',
  QuantityReducedMaxAvailable = 'Quantity Reduced: Max Available',
  SoldOut = 'Sold Out',
  SaleNotStarted = 'Sale Not Started',
  SaleEnded = 'Sale Ended',
  TicketTypeNotFound = 'Ticket Type Not Found',
}

export interface ValidatedItem {
  ticketTypeId: string;
  name: string;
  requestedQuantity: number;
  validatedQuantity: number;
  pricePerTicket: number;
  feesPerTicket: number;
  message: ValidatedItemMessage;
}
