// app/api/checkout/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // For reading cookies in App Router
import prisma from '@/server/prisma';
import Stripe from 'stripe';
import { UserDetailsFormData } from '@/lib/schemas/checkoutSchema'; // Adjust path if needed
import { OrderStatus, TicketFeeStructure, TicketStatus } from '@prisma/client';
import admin from '@/server/lib/firebaseAdmin'; // Adjust path if needed
import { generateId } from '@/lib/utils'; // Adjust path if needed
import {
  ValidatedItem,
  ValidatedItemMessage,
  ValidationResponse,
  ValidationResponseMessage,
} from '@/types/checkout'; // Adjust path if needed
import { calculateFees } from '@/server/lib/checkout'; // Adjust path if needed
import { Prisma } from '@prisma/client';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2024-04-10',
});

interface InitiateRequestData {
  eventId: string;
  selectedTickets: Record<string, number>; // { ticketTypeId: quantity }
  userDetails: UserDetailsFormData;
  promotionCode?: string;
}

interface CreateOrderDataInternal {
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
const ticketTypeWithPendingAndCompletedOrdersSelect = {
  id: true,
  eventId: true,
  name: true,
  description: true,
  price: true,
  quantity: true,
  quantitySold: true,
  maxPurchasePerUser: true,
  saleStartDate: true,
  saleEndDate: true,
  ticketingFees: true,
  ticketType: true,
  discountCode: true,
  createdAt: true,
  updatedAt: true,
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
} satisfies Prisma.TicketTypesSelect;

type ticketTypeWithRawData = Prisma.TicketTypesGetPayload<{
  select: typeof ticketTypeWithPendingAndCompletedOrdersSelect;
}>;

type ticketTypeWithPendingAndCompletedOrders = ticketTypeWithRawData & {
  pendingOrders: number;
  completedOrders: number;
};

export async function POST(
  req: NextRequest
): Promise<NextResponse<ValidationResponse | { message: string }>> {
  let userId: string | null = null;

  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('fb-token');
    if (!tokenCookie?.value) {
      userId = null;
    } else {
      const decoded = await admin.auth().verifyIdToken(tokenCookie.value);
      userId = decoded.uid;
    }
  } catch (error) {
    console.error(
      'Error verifying Firebase token during checkout initiation:',
      error
    );

    userId = null;
  }

  // TODO: Further authentication/authorization checks if needed beyond Firebase token.

  try {
    const { eventId, selectedTickets, userDetails }: InitiateRequestData =
      await req.json();

    if (
      !eventId ||
      !selectedTickets ||
      Object.keys(selectedTickets).length === 0
    ) {
      return NextResponse.json(
        { message: 'Missing required fields or no tickets selected' },
        { status: 400 }
      );
    }

    const validationResult = await prisma.$transaction(
      async (tx) => {
        const event = await tx.events.findUnique({
          where: { id: eventId },
        });

        if (!event) {
          const error = new Error('Event not found');
          (error as any).statusCode = 404;
          throw error;
        }

        const rawTicketStats = await tx.ticketTypes.findMany({
          where: {
            eventId: eventId,
            id: { in: Object.keys(selectedTickets) },
          },
          select: ticketTypeWithPendingAndCompletedOrdersSelect,
        });

        const ticketStats = rawTicketStats.map((tt) => ({
          ...tt,
          pendingOrders: tt.tickets.length,
          completedOrders: tt._count.tickets,
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
          orderId: null,
          clientSecret: null,
          expiresAt: null, // TODO: Consider setting an expiry for pending orders
        };

        // --- Validate Selected Tickets ---
        for (const ticketTypeId in selectedTickets) {
          const requestedQuantity = selectedTickets[ticketTypeId];
          if (requestedQuantity <= 0) continue;

          const ticketType =
            ticketStats.find((tt) => tt.id === ticketTypeId) ?? null;
          const validation = validateTicketType(ticketType, requestedQuantity); // ticketType can be null

          if (validation.validatedQuantity < requestedQuantity) {
            response.wasAdjusted = true;
          }

          const pricePerTicketNum = ticketType?.price ?? 0;
          let feesPerTicketNum = 0;
          if (
            ticketType &&
            ticketType.ticketingFees !== TicketFeeStructure.ABSORB_TICKET_FEES
          ) {
            feesPerTicketNum = calculateFees(pricePerTicketNum);
          }

          response.validatedItems.push({
            ticketTypeId,
            name: ticketType?.name ?? 'Unknown Ticket Type',
            requestedQuantity,
            validatedQuantity: validation.validatedQuantity,
            pricePerTicket: pricePerTicketNum,
            feesPerTicket: feesPerTicketNum,
            message: validation.message,
          });
        }

        response.isValid = response.validatedItems.some(
          (item) => item.validatedQuantity > 0
        );

        // --- Set Response Message ---
        if (response.wasAdjusted && response.isValid) {
          response.message = ValidationResponseMessage.SomeTicketsUnavailable;
        } else if (
          !response.isValid &&
          Object.keys(selectedTickets).length > 0
        ) {
          response.message = ValidationResponseMessage.AllTicketInvalid;
        } else if (Object.keys(selectedTickets).length === 0) {
          response.message = ValidationResponseMessage.NoTicketsSelected;
          response.isValid = false;
        } else if (!response.wasAdjusted && response.isValid) {
          response.message = ValidationResponseMessage.AllTicketsValidated;
        }

        // --- Calculate Totals and Create Order if Valid ---
        if (response.isValid) {
          // TODO: Add promotion code validation and application logic here
          // It should adjust subtotal, fees, or total before these calculations.

          const { subtotal, fee: feesTotal } = calculateCartTotal(
            ticketStats,
            response.validatedItems
          );
          response.subtotal = subtotal;
          response.fees = feesTotal;
          response.total = subtotal + feesTotal;
          response.isFree = response.total === 0;

          // --- Create Order in Database ---
          const order = await createOrderInDatabase(
            tx,
            {
              eventId,
              userId: userId ?? undefined,
              userDetails,
              validatedItems: response.validatedItems,
              subtotal: response.subtotal,
              fees: response.fees,
              total: response.total,
            },
            response.isFree ? DbOrderType.Free : DbOrderType.Paid
          );
          response.orderId = order.id;
          // TODO: If order is PENDING, set response.expiresAt

          // --- Handle Stripe Payment Intent or Free Order Completion ---
          if (!response.isFree) {
            let stripeCustomerId: string | undefined;
            // Manage Stripe Customer
            if (userId) {
              const user = await tx.users.findUnique({ where: { id: userId } });
              if (user?.stripeId) {
                stripeCustomerId = user.stripeId;
              } else {
                const newStripeCustomer = await stripe.customers.create({
                  name: `${userDetails.firstName} ${userDetails.lastName}`,
                  email: userDetails.email,
                  metadata: { internalUserId: userId },
                });
                await tx.users.update({
                  where: { id: userId },
                  data: { stripeId: newStripeCustomer.id },
                });
                stripeCustomerId = newStripeCustomer.id;
              }
            } else {
              // Guest user
              const guestStripeCustomer = await stripe.customers.create({
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email,
                metadata: { guestUser: 'true' },
              });
              stripeCustomerId = guestStripeCustomer.id;
            }

            const paymentIntent = await stripe.paymentIntents.create({
              amount: Math.round(response.total * 100),
              currency: 'usd',
              customer: stripeCustomerId,
              description: `Order ${order.id} for event ${event.name}`,
              automatic_payment_methods: { enabled: true },
              metadata: {
                orderId: order.id,
                eventId: eventId,
                eventName: event.name ?? 'Unknown Event',
                userId: userId ?? 'Guest',
              },
            });
            response.clientSecret = paymentIntent.client_secret;

            await tx.orders.update({
              where: { id: order.id },
              data: {
                stripePaymentId: paymentIntent.id,
                stripeCustomerId: stripeCustomerId,
              },
            });
          } else {
            for (const item of response.validatedItems) {
              if (item.validatedQuantity > 0) {
                await tx.ticketTypes.update({
                  where: { id: item.ticketTypeId },
                  data: {
                    quantitySold: { increment: item.validatedQuantity },
                  },
                });
              }
            }
          }
        }
        return response;
      },
      {
        maxWait: 10000,
        timeout: 25000,
        // TODO: isolation level and retry logic
      }
    );

    return NextResponse.json(validationResult, { status: 200 });
  } catch (error: any) {
    console.error('Error in checkout initiation:', error);
    if (error.statusCode) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: 'Database error during checkout.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Internal Server Error during checkout initiation.' },
      { status: 500 }
    );
  }
}

// --- Helper Functions (can be kept in the same file or moved to a utils/server-helpers file) ---

/**
 * Validates a single ticket type against requested quantity and availability.
 */
function validateTicketType(
  ticketType: ticketTypeWithPendingAndCompletedOrders | null,
  requestedQuantity: number
): { message: ValidatedItemMessage; validatedQuantity: number } {
  if (!ticketType) {
    return {
      message: ValidatedItemMessage.TicketTypeNotFound,
      validatedQuantity: 0,
    };
  }
  const now = new Date();
  if (ticketType.saleStartDate && new Date(ticketType.saleStartDate) > now) {
    return {
      message: ValidatedItemMessage.SaleNotStarted,
      validatedQuantity: 0,
    };
  }
  if (ticketType.saleEndDate && new Date(ticketType.saleEndDate) < now) {
    return {
      message: ValidatedItemMessage.SaleEnded,
      validatedQuantity: 0,
    };
  }

  // Effective quantitySold = actual quantitySold (from COMPLETED free orders) + completedOrders (from Stripe paid)
  // This needs to be careful: ticketType.quantitySold is for FREE completed tickets.
  // ticketType.completedOrders is for PAID completed tickets.
  // For available stock, we need total capacity - (all completed tickets) - (all pending tickets)
  const totalSoldOrPending =
    (ticketType.completedOrders || 0) + (ticketType.pendingOrders || 0);
  const availableStock = Math.max(0, ticketType.quantity - totalSoldOrPending);

  if (availableStock <= 0) {
    return {
      message: ValidatedItemMessage.SoldOut,
      validatedQuantity: 0,
    };
  }

  let validatedQuantity = Math.min(requestedQuantity, availableStock);
  if (ticketType.maxPurchasePerUser > 0) {
    validatedQuantity = Math.min(
      validatedQuantity,
      ticketType.maxPurchasePerUser
    );
  }

  if (validatedQuantity < requestedQuantity) {
    if (
      validatedQuantity === availableStock &&
      validatedQuantity < ticketType.maxPurchasePerUser
    ) {
      return {
        message: ValidatedItemMessage.QuantityReducedMaxAvailable,
        validatedQuantity,
      };
    } else if (
      validatedQuantity === ticketType.maxPurchasePerUser &&
      validatedQuantity < availableStock
    ) {
      return {
        message: ValidatedItemMessage.QuantityReducedMaxAvailable,
        validatedQuantity,
      };
    } else {
      return {
        message: ValidatedItemMessage.QuantityReducedMaxAvailable,
        validatedQuantity,
      };
    }
  }

  return {
    message: ValidatedItemMessage.Available,
    validatedQuantity: validatedQuantity,
  };
}

/**
 * Calculates subtotal and fees for the cart.
 * ticketStats prices are numbers.
 * validatedItems contains numeric prices/fees per ticket (already converted).
 */
function calculateCartTotal(
  ticketStats: ticketTypeWithPendingAndCompletedOrders[],
  validatedItemsNum: ValidatedItem[]
): { subtotal: number; fee: number } {
  let subtotal = 0;
  let fees = 0;

  for (const item of validatedItemsNum) {
    if (item.validatedQuantity <= 0) continue;
    const ticketType = ticketStats.find((tt) => tt.id === item.ticketTypeId);
    if (ticketType) {
      subtotal += ticketType.price * item.validatedQuantity; // Direct number math

      if (ticketType.ticketingFees !== TicketFeeStructure.ABSORB_TICKET_FEES) {
        const singleTicketPrice = ticketType.price; // This is a number
        const feePerSingleTicket = calculateFees(singleTicketPrice); // Assumes number in, number out
        fees += feePerSingleTicket * item.validatedQuantity;
      }
    }
  }

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    fee: parseFloat(fees.toFixed(2)),
  };
}

enum DbOrderType {
  Paid = 'PAID',
  Free = 'FREE',
  Complementary = 'COMPLEMENTARY',
}

/**
 * Creates an order record in the database.
 * MUST be called within a Prisma transaction.
 */
async function createOrderInDatabase(
  prismaTx: Omit<Prisma.TransactionClient, '$commit' | '$rollback'>,
  orderData: CreateOrderDataInternal,
  orderType: DbOrderType
) {
  const orderStatus =
    orderType === DbOrderType.Free
      ? OrderStatus.COMPLETED
      : OrderStatus.PENDING;
  const isOrderFree = orderType === DbOrderType.Free;

  const prismaOrderPayload = getPrismaCreateOrderPayload(
    orderData,
    orderStatus,
    isOrderFree
  );

  const createdOrder = await prismaTx.orders.create({
    data: prismaOrderPayload,
  });

  return createdOrder;
}

/**
 * Generates the Prisma payload for creating an order.
 * orderData contains numeric values for currency, Prisma handles conversion to Decimal.
 */
function getPrismaCreateOrderPayload(
  orderData: CreateOrderDataInternal,
  status: OrderStatus,
  isFree: boolean
): Prisma.OrdersCreateInput {
  const orderItemsCreateData = orderData.validatedItems
    .filter((item) => item.validatedQuantity > 0)
    .flatMap((item) =>
      Array.from({ length: item.validatedQuantity }, () => ({
        id: generateId(),
        ticketTypeId: item.ticketTypeId,
        subtotal: isFree ? 0 : item.pricePerTicket,
        fees: isFree ? 0 : item.feesPerTicket,
        total: isFree ? 0 : item.pricePerTicket + item.feesPerTicket,
        firstName: orderData.userDetails.firstName,
        lastName: orderData.userDetails.lastName,
        email: orderData.userDetails.email,
        eventId: orderData.eventId,
        status: isFree ? TicketStatus.AVAILABLE : TicketStatus.NOT_AVAILABLE, // Or based on payment?
      }))
    );

  const orderInput: Prisma.OrdersCreateInput = {
    id: generateId(),
    status: status,
    subtotal: isFree ? 0 : orderData.subtotal,
    fees: isFree ? 0 : orderData.fees,
    total: isFree ? 0 : orderData.total,
    stripePaymentId:
      status === OrderStatus.PENDING ? orderData.stripePaymentIntentId : null,
    firstName: orderData.userDetails.firstName,
    lastName: orderData.userDetails.lastName,
    email: orderData.userDetails.email,
    event: { connect: { id: orderData.eventId } },
    tickets: { createMany: { data: orderItemsCreateData } },
  };

  if (orderData.userId) {
    orderInput.user = { connect: { id: orderData.userId } };
  }

  return orderInput;
}
