type Ticket = {
  // Define the properties of the Ticket type here
};

type Order = {
  id: string;
  stripeCustomerId: string;
  eventId: string;
  total: number;
  subtotal: number;
  fees: number;
  userId: string;
  name: string;
  email: string;
  telephoneNumber: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingZip: string;
  billingState: string;
  billingCountry: string;
  tickets: Ticket[];
  ticketsLink?: string;
};
