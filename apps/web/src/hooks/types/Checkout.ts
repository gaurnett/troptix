import { TicketsType } from './Ticket';

export interface Checkout {
  id?: string;
  eventId?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  confirmEmail?: string;
  total?: number;
  subtotal?: number;
  fees?: number;
  promotionApplied?: boolean;
  telephoneNumber?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity?: string;
  billingZip?: string;
  billingState?: string;
  billingCountry?: string;
  tickets: Map<string, CheckoutTicket>;
}

export function initializeCheckout(user: any, eventId: string): Checkout {
  const checkout: Checkout = {
    id: '',
    eventId: eventId,
    userId: user?.id,
    total: 0,
    subtotal: 0,
    fees: 0,
    promotionApplied: false,
    telephoneNumber: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingZip: '',
    billingState: '',
    billingCountry: '',
    tickets: new Map(),
  };

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
  ticketType: TicketsType;
}

export function initializeCheckoutTicket(ticket): CheckoutTicket {
  const checkoutTicket: CheckoutTicket = {
    id: '',
    ticketTypeId: ticket.id,
    eventId: ticket.eventId,
    name: ticket.name,
    description: ticket.description,
    quantitySelected: 0,
    fees: 0,
    subtotal: 0,
    total: 0,
    ticketType: TicketsType.PAID,
  };

  return checkoutTicket;
}
