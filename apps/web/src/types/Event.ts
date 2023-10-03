import { TicketType } from "./TicketType";
export type EventType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  name: string;
  description: string;
  organizer: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  address: string;
  country: string;
  ticketTypes: TicketType[];
};
