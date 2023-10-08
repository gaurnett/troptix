export type TicketType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  maxPurchasePerUser: number;
  quantity: number;
  saleStartDate: string;
  saleStartTime: string;
  saleEndDate: string;
  saleEndTime: string;
  price: number;
  ticketingFees: string;
  eventId: string;
};
