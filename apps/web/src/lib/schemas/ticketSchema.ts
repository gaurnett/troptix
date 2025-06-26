import { z } from 'zod';

// Define the enum based on your Prisma schema for TicketFeeStructure
export const TicketFeeStructure = z.enum([
  'ABSORB_TICKET_FEES',
  'PASS_TICKET_FEES',
]);

const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

export const ticketTypeSchema = z
  .object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
    description: z.string().optional(),
    price: z.coerce // Coerce input string to number
      .number({ invalid_type_error: 'Price must be a number.' })
      .min(0, { message: 'Price cannot be negative.' })
      .multipleOf(0.01, {
        message: 'Price must have at most 2 decimal places.',
      }),
    quantity: z.coerce // Coerce input string to number
      .number({ invalid_type_error: 'Quantity must be a number.' })
      .int({ message: 'Quantity must be a whole number.' })
      .positive({ message: 'Quantity must be greater than zero.' }),
    maxPurchasePerUser: z.coerce // Coerce input string to number
      .number({ invalid_type_error: 'Max purchase must be a number.' })
      .int({ message: 'Max purchase must be a whole number.' })
      .positive({ message: 'Max purchase must be greater than zero.' }),
    saleStartDate: z.date({
      required_error: 'Sale start date is required.',
    }),
    saleEndDate: z.date({ required_error: 'Sale end date is required.' }),
    ticketingFees: TicketFeeStructure,
  })
  .refine((data) => data.saleEndDate > data.saleStartDate, {
    message: 'Sale end date must be after the start date.',
    path: ['saleEndDate'], // Associate error with the end date field
  });

// Type inferred from the schema
export type TicketTypeFormValues = z.infer<typeof ticketTypeSchema>;
