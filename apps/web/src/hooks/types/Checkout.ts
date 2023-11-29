export interface Checkout {
  id: string;
  eventId: string;
  userId: string;
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

export function initializeCheckout(user: any): Checkout {
  const checkout: Checkout = {
    id: "",
    eventId: "",
    userId: user?.id,
    name: user?.name,
    email: user?.email,
    total: 0,
    subtotal: 0,
    fees: 0,
    discountedSubtotal: 0,
    discountedTotal: 0,
    discountedFees: 0,
    promotionApplied: false,
    telephoneNumber: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingZip: "",
    billingState: "",
    billingCountry: "",
    tickets: new Map()
  }

  return checkout;
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
