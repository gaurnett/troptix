import { TicketFeeStructure } from '@prisma/client';
import { z } from 'zod';

// Define the ticket type schema ONCE
export const ticketTypeSchema = z.object({
  id: z.string().optional(), // Keep RHF's internal ID optional if needed for editing state
  name: z.string().min(1, { message: 'Ticket name is required.' }),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number.' })
    .min(0),
  quantity: z.coerce
    .number({ invalid_type_error: 'Quantity must be a number.' })
    .int()
    .min(1),
  saleStartDate: z.date({ required_error: 'Sale start date is required.' }),
  saleStartTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'Start time must be HH:MM.',
    })
    .optional(),
  saleEndDate: z.date({ required_error: 'Sale end date is required.' }),
  saleEndTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'End time must be HH:MM.',
    })
    .optional(),
  description: z
    .string()
    .min(1, { message: 'Ticket description is required.' }),
  maxPurchasePerUser: z.coerce
    .number()
    .int()
    .positive({ message: 'Must be at least 1.' })
    .min(1)
    .optional(),
  ticketingFees: z.nativeEnum(TicketFeeStructure),
});

export type TicketFormValues = z.infer<typeof ticketTypeSchema>;

export const eventFormSchema = z
  .object({
    eventName: z.string().min(3, {
      message: 'Event name must be at least 3 characters.',
    }),
    description: z.string().min(1, { message: 'Description is required.' }),
    startDate: z.date({
      required_error: 'Start date is required.',
      invalid_type_error: 'Start date must be a valid date.', // Added invalid type error
    }),
    organizer: z.string().min(1, { message: 'Name of organizer is required.' }),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        // Escaped \d for regex
        message: 'Start time must be in HH:MM format (e.g., 09:30).',
      }) // Validate HH:MM format
      .min(1, { message: 'Start time is required.' }),
    endDate: z.date({
      required_error: 'End date is required.',
      invalid_type_error: 'End date must be a valid date.', // Added invalid type error
    }),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        // Escaped \d for regex
        message: 'End time must be in HH:MM format (e.g., 17:00).',
      }) // Validate HH:MM format
      .min(1, { message: 'End time is required.' }),
    venue: z.string().min(1, { message: 'Venue is required.' }),
    address: z.string().min(5, {
      message: 'Street address details are required (min 5 chars).',
    }),
    country: z.string().optional(),
    countryCode: z.string().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    tickets: z.array(ticketTypeSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.endDate > data.startDate) {
        return true;
      }
      if (data.startDate > data.endDate) {
        return false;
      }
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: 'Event must end after it starts.',
      path: ['endDate'], // Keep error attached to endDate
    }
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;
