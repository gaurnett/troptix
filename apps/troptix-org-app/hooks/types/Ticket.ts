export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export enum TicketType {
  FREE = 'FREE',
  PAID = 'PAID',
  COMPLEMENTARY = 'COMPLEMENTARY',
}

export type Ticket = {
  id?: string;
  ticketTypeId?: string;
  ticketType?: TicketType;
  status?: TicketStatus;
  eventId?: string;
  userId?: string;
  orderId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  description?: string;
  price?: number;
  fees?: number;
  subtotal?: number;
  total?: number;
};
