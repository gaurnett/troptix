// pages/api/checkout/initiate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prisma'; // Adjust path
import Stripe from 'stripe';
// Import your calculation helpers, e.g., calculateFeesServerSide
// Import shared types (ensure these are defined, e.g., in hooks/types/):
import { UserDetailsFormData } from '@/lib/schemas/checkoutSchema'; // Adjust path
import { getCookie } from 'cookies-next';
import {
  OrderStatus,
  TicketFeeStructure,
  TicketStatus,
  TicketTypes,
} from '@prisma/client'; // Assuming you have OrderStatus enum in Prisma schema
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import admin from '@/server/lib/firebaseAdmin';
import { generateId } from '@/lib/utils';
import {
  ValidatedItem,
  ValidatedItemMessage,
  ValidationResponse,
  ValidationResponseMessage,
} from '@/types/checkout';
import { calculateFees } from '@/server/lib/checkout';
// Define the expected Request Body structure

// Initialize Stripe (use environment variables for secret key)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2024-04-10', // Use the latest API version
});

interface InitiateRequestData {
  eventId: string;
  selectedTickets: Record<string, number>; // { ticketTypeId: quantity }
  userDetails: UserDetailsFormData;
  promotionCode?: string;
}

interface TicketTypeWithStats extends TicketTypes {
  pendingOrders: number;
  completedOrders: number;
  _count: {
    tickets: number;
  };
  tickets: {
    id: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResponse | { message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  let userId: string | null = null;
  // Get the user id from the cookie
  try {
    const token = await getCookie('fb-token', { req: req, res: res });
    if (!token) {
      userId = null;
    } else {
      const decoded = await admin.auth().verifyIdToken(token as string);
      userId = decoded.uid;
    }
  } catch (error) {
    // If there is an error, set the user id to null
    console.error('Error in checkout initiation:', error);
    userId = null;
  }

  // TODO: Add authentication and Anonymous User Check so that we can only authenticated users hitting this endpoint

  try {
    const {
      eventId,
      selectedTickets,
      userDetails,
      promotionCode,
    }: InitiateRequestData = req.body;

    console.log('req.body', req.body);

    if (
      !eventId ||
      !selectedTickets ||
      Object.keys(selectedTickets).length === 0
    ) {
      return res
        .status(400)
        .json({ message: 'Missing required fields or no tickets selected' });
    }

    // --- Use Prisma Transaction ---
    const validationResult = await prisma.$transaction(
      async (tx: PrismaClient) => {
        const event = await tx.events.findUnique({
          where: { id: eventId },
          include: {
            ticketTypes: {
              select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
                quantitySold: true,
                maxPurchasePerUser: true,
                saleStartDate: true,
                saleEndDate: true,
                ticketingFees: true,
                ticketType: true,
                discountCode: true,
              },
            },
          },
        });

        if (!event) throw new Error('Event not found');

        const pendingAndCompletedOrders = await tx.ticketTypes.findMany({
          where: {
            eventId: eventId,
          },
          include: {
            // count of tickets sold
            _count: {
              select: {
                tickets: {
                  where: {
                    order: {
                      status: OrderStatus.COMPLETED,
                    },
                  },
                },
              },
            },
            // array of tickets pending
            tickets: {
              where: {
                order: {
                  status: OrderStatus.PENDING,
                },
              },
              select: {
                id: true,
              },
            },
          },
        });
        // This needs a better name
        const ticketStats = pendingAndCompletedOrders.map((ticketType) => ({
          ...ticketType,
          pendingOrders: ticketType.tickets.length,
          completedOrders: ticketType._count.tickets,
        }));

        // --- Initialize Response Object ---
        const response: ValidationResponse = {
          isValid: false,
          wasAdjusted: false,
          validatedItems: [],
          subtotal: 0,
          fees: 0,
          total: 0,
          promotionApplied: null,
          message: null,
          isFree: false,
          orderId: null, // Will be added after order creation
          clientSecret: null, // Will be added after PI creation
          expiresAt: null, // Will be added after order creation
        };

        for (const ticketTypeId in selectedTickets) {
          const requestedQuantity = selectedTickets[ticketTypeId];
          if (requestedQuantity <= 0) continue;
          const ticketType =
            ticketStats.find((tt) => tt.id === ticketTypeId) ?? null;

          const { validatedQuantity, message } = validateTicketType(
            ticketType,
            requestedQuantity
          );
          if (validatedQuantity < requestedQuantity) {
            response.wasAdjusted = true;
          }
          response.validatedItems.push({
            ticketTypeId,
            name: ticketType?.name ?? 'Unknown Ticket Type',
            requestedQuantity,
            validatedQuantity,
            pricePerTicket: ticketType?.price ?? 0,
            feesPerTicket:
              ticketType?.ticketingFees ===
              TicketFeeStructure.ABSORB_TICKET_FEES
                ? 0
                : calculateFees(ticketType?.price ?? 0),
            message,
          });
        }
        // If any tickets have a validated quantity greater than 0, set isValid to true otherwise set to false
        response.isValid = response.validatedItems.some(
          (item) => item.validatedQuantity > 0
        );
        // --- Set the response message ---
        // This probably needs to be refactored
        if (response.wasAdjusted && response.isValid) {
          response.message = ValidationResponseMessage.SomeTicketsUnavailable;
        }
        if (!response.wasAdjusted && !response.isValid) {
          response.message = ValidationResponseMessage.AllTicketInvalid;
        }
        if (Object.keys(selectedTickets).length === 0) {
          response.message = ValidationResponseMessage.NoTicketsSelected;
        }
        if (!response.wasAdjusted && response.isValid) {
          response.message = ValidationResponseMessage.AllTicketsValidated;
        }

        if (response.isValid) {
          // TODO: Add promotion code validation and calculation
          const { subtotal, fee } = calculateCartTotal(
            ticketStats,
            response.validatedItems
          );
          response.subtotal = parseFloat(subtotal.toFixed(2));
          response.fees = parseFloat(fee.toFixed(2));
          response.total = parseFloat((subtotal + fee).toFixed(2));
          response.isFree = response.subtotal === 0;
          console.log('isFree', response.isFree);
        }
        // --- Create the Order ---
        if (response.isValid) {
          const order = await createOrderInDatabase(
            tx,
            {
              eventId,
              userId: userId ?? undefined, // Guest checkout if no user id
              userDetails,
              validatedItems: response.validatedItems,
              subtotal: response.subtotal,
              fees: response.fees,
              total: response.total,
            },
            response.isFree ? DbOrderType.Free : DbOrderType.Paid
          );
          response.orderId = order.id;

          // --- Create the Payment Intent ---
          // If paid, create PI and update order with PI ID
          // Fetch Customer ID from Stripe
          // TODO: Create a Customer Table to store customer details
          let customerId = '';
          if (userId) {
            const user = await prisma.users.findUnique({
              where: {
                id: userId,
              },
            });
            if (!user?.stripeId) {
              const customer = await stripe.customers.create({
                name: userDetails.firstName + ' ' + userDetails.lastName,
                email: userDetails.email,
              });
              await prisma.users.update({
                where: { id: userId },
                data: { stripeId: customer.id },
              });
              customerId = customer.id;
            } else {
              customerId = user?.stripeId;
            }
          } else {
            const customer = await stripe.customers.create({
              name: userDetails.firstName + ' ' + userDetails.lastName,
              email: userDetails.email,
            });
            customerId = customer.id;
          }
          if (!response.isFree) {
            const paymentIntent = await stripe.paymentIntents.create({
              amount: response.total * 100,
              currency: 'usd',
              customer: customerId,
              description: `Order # ${order.id} for ${event.name}`,
              automatic_payment_methods: {
                enabled: true,
              },
              metadata: {
                orderId: order.id,
                eventId: eventId,
                eventName: event.name,
                userId: userId ?? 'Guest',
              },
            });
            response.clientSecret = paymentIntent.client_secret;
            await tx.orders.update({
              where: { id: order.id },
              data: {
                stripePaymentId: paymentIntent.id,
                stripeCustomerId: customerId,
              },
            });
          } else {
            // Free orders need to update ticket quantity sold
            // For each ticket in validatedItems, update the quantity sold
            for (const ticket of response.validatedItems) {
              await tx.ticketTypes.update({
                where: { id: ticket.ticketTypeId },
                data: { quantitySold: { increment: ticket.validatedQuantity } },
              });
            }
          }
        }

        return response;
      },
      {
        timeout: 15000, // 15 seconds timeout
      }
    );
    console.log('response', validationResult);
    return res.status(200).json(validationResult);
  } catch (error) {
    console.error('Error in checkout initiation:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
/**
 * Validate the ticket type
 * @param ticketType - The ticket type to validate
 * @param requestedQuantity - The quantity requested
 * @returns - The validation result
 *
 * isValid: boolean - Whether the ticket type is valid
 * message: string - The message to display to the user
 * validatedQuantity: number - The quantity validated
 */
function validateTicketType(
  ticketType: TicketTypeWithStats | null,
  requestedQuantity: number
): { message: ValidatedItemMessage; validatedQuantity: number } {
  if (!ticketType) {
    return {
      message: ValidatedItemMessage.TicketTypeNotFound,
      validatedQuantity: 0,
    };
  }
  // Check if the saleStartDate is in the future
  if (
    ticketType.saleStartDate &&
    new Date(ticketType.saleStartDate) > new Date()
  ) {
    return {
      message: ValidatedItemMessage.SaleNotStarted,
      validatedQuantity: 0,
    };
  }

  // Check if the ticketType is on sale
  if (ticketType.saleEndDate && new Date(ticketType.saleEndDate) < new Date()) {
    return {
      message: ValidatedItemMessage.SaleEnded,
      validatedQuantity: 0,
    };
  }

  // Check if the quantity remaing is greater than 0
  if (
    ticketType.quantity -
      (ticketType?.quantitySold ?? 0) -
      (ticketType?.pendingOrders ?? 0) <=
    0
  ) {
    return {
      message: ValidatedItemMessage.SoldOut,
      validatedQuantity: 0,
    };
  }
  // Tickets are available, check if the quantity requested is greater than the quantity available
  if (
    (ticketType?.quantitySold ?? 0) +
      (ticketType?.pendingOrders ?? 0) +
      requestedQuantity >
    ticketType.quantity
  ) {
    const availableQuantity =
      ticketType.quantity -
      (ticketType?.quantitySold ?? 0) -
      (ticketType?.pendingOrders ?? 0);
    const maxPurchasePerUser = ticketType.maxPurchasePerUser ?? 0;
    const validatedQuantity = Math.min(availableQuantity, maxPurchasePerUser);

    return {
      message: ValidatedItemMessage.QuantityReducedMaxAvailable,
      validatedQuantity: validatedQuantity,
    };
  }

  return {
    message: ValidatedItemMessage.Available,
    validatedQuantity: requestedQuantity,
  };
}

function calculateCartTotal(
  ticketStats: TicketTypeWithStats[],
  validatedTickets: ValidatedItem[]
): { subtotal: number; fee: number; total: number } {
  let subtotal = 0;
  let fee = 0;
  // Calculate the subtotal for the cart
  for (const ticket of validatedTickets) {
    if (ticket.validatedQuantity <= 0) continue;
    const ticketType = ticketStats.find((tt) => tt.id === ticket.ticketTypeId);
    if (ticketType) {
      subtotal += ticketType.price * ticket.validatedQuantity;
      fee +=
        ticketType.ticketingFees === TicketFeeStructure.ABSORB_TICKET_FEES
          ? 0
          : calculateFees(ticketType.price * ticket.validatedQuantity);
    }
  }
  // Calculate the total for the cart
  const total = subtotal + fee;
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    fee: parseFloat(fee.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
}

export enum DbOrderType {
  Paid = 'PAID',
  Free = 'FREE',
  Complementary = 'COMPLEMENTARY',
}

// Define the data needed to create any order
interface CreateOrderData {
  eventId: string;
  userId?: string;
  userDetails: UserDetailsFormData;
  validatedItems: ValidatedItem[];
  subtotal: number;
  fees: number;
  total: number;
  stripePaymentIntentId?: string;
  expiresAt?: Date;
}

/**
 * Creates an order record in the database.
 * Handles generating Prisma payload based on order type.
 * Optionally updates ticket stats for completed non-paid orders.
 * MUST be called within a Prisma transaction if transaction consistency is needed.
 * @param prismaTx - The Prisma client or transaction client instance
 * @param orderData - The validated and calculated order details
 * @param orderType - The type of order being created
 */
export async function createOrderInDatabase(
  prismaTx: Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >, // Prisma transaction client type
  orderData: CreateOrderData,
  orderType: DbOrderType
) {
  let prismaOrderPayload: Prisma.OrdersCreateInput;

  switch (orderType) {
    case DbOrderType.Free:
      prismaOrderPayload = getPrismaCreateOrderPayload(
        orderData,
        OrderStatus.COMPLETED,
        true
      );
      break;

    case DbOrderType.Paid:
      prismaOrderPayload = getPrismaCreateOrderPayload(
        orderData,
        OrderStatus.PENDING,
        false
      );
      break;

    default:
      throw new Error(`Unsupported order type for creation: ${orderType}`);
  }

  // --- Create the Order ---
  const createdOrder = await prismaTx.orders.create({
    data: prismaOrderPayload,
  });

  return createdOrder;
}

/**
 * Creates a Prisma payload for creating an order in the database.
 * Handles generating Prisma payload based on order type.
 * @param orderData - The validated and calculated order details
 * @param status - The status of the order
 * @param isFree - Whether the order is free
 * @returns - The Prisma payload for creating an order
 */
export function getPrismaCreateOrderPayload(
  orderData: CreateOrderData,
  status: OrderStatus,
  isFree: boolean
): Prisma.OrdersCreateInput {
  // Map validated items (tickets) to the structure needed for OrderItems relation create
  const orderItemsCreateData = orderData.validatedItems
    .filter((item) => item.validatedQuantity > 0)
    .flatMap((item) =>
      Array.from({ length: item.validatedQuantity }, () => ({
        id: generateId(), // Generate a unique id for the order item
        ticketTypeId: item.ticketTypeId,
        subtotal: isFree ? 0 : item.pricePerTicket,
        fees: isFree ? 0 : item.feesPerTicket,
        total: isFree ? 0 : item.pricePerTicket + item.feesPerTicket,
        firstName: orderData.userDetails.firstName,
        lastName: orderData.userDetails.lastName,
        email: orderData.userDetails.email,
        eventId: orderData.eventId,
        status: isFree ? TicketStatus.AVAILABLE : TicketStatus.NOT_AVAILABLE,
      }))
    );

  // Base order input
  const orderInput: Prisma.OrdersCreateInput = {
    id: generateId(), // Generate a unique id for the order
    status: status,
    subtotal: isFree ? 0 : orderData.subtotal,
    fees: isFree ? 0 : orderData.fees,
    total: isFree ? 0 : orderData.total,
    stripePaymentId:
      status === OrderStatus.PENDING ? orderData.stripePaymentIntentId : null,

    // Customer Details
    firstName: orderData.userDetails.firstName,
    lastName: orderData.userDetails.lastName,
    email: orderData.userDetails.email,
    // Add other customer details from orderData.userDetails if needed/available

    // Relations
    event: {
      connect: {
        id: orderData.eventId,
      },
    },
    tickets: {
      createMany: {
        data: orderItemsCreateData,
      },
    },
  };

  // Connect user if userId is provided (Guest checkout)
  if (orderData.userId) {
    orderInput.user = {
      connect: {
        id: orderData.userId,
      },
    };
  }

  return orderInput;
}
