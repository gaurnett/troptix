export interface Checkout {
  id: string;
  eventId: string;
  name: string;
  email: string;
  total: number;
  subtotal: number;
  fees: number;
  discountedSubtotal: number;
  discountedTotal: number;
  discountedFees: number;
  promotionApplied: boolean;
  telephoneNumber: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingZip: string;
  billingState: string;
  billingCountry: string;
  tickets: Map<string, CheckoutTicket>;
}

export interface CheckoutTicket {
  id: string;
  ticketTypeId: string;
  eventId: string;
  name: string;
  description: string;
  quantitySelected: number;
  fees: number;
  subtotal: number;
  total: number;
}
