export type Ticket = {
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
};
