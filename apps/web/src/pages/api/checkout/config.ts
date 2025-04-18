// pages/api/checkout/config.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prisma'; // Adjust path to your Prisma client
import { OrderStatus, TicketFeeStructure, TicketTypes } from '@prisma/client'; // Import necessary Prisma Enums
import { calculateFees } from '@/server/lib/checkout';
import { CheckoutConfigResponse, CheckoutTicket } from '@/types/checkout';

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
  res: NextApiResponse<CheckoutConfigResponse | { message: string }>
) {
  // 1. Check HTTP Method
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      message: `Method ${req.method} Not Allowed`,
    });
  }

  // TODO: Add authentication so only users or anonymous users can hit this endpoint
  //let userId: string | null = null;

  // Extract and Validate Query Parameters
  const { eventId } = req.query;

  if (!eventId || typeof eventId !== 'string') {
    return res
      .status(400)
      .json({ message: 'Missing or invalid "eventId" query parameter.' });
  }

  try {
    const ticketTypesData: TicketTypeWithStats[] =
      await prisma.ticketTypes.findMany({
        where: {
          eventId: eventId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true, // Total capacity
          maxPurchasePerUser: true,
          saleStartDate: true,
          saleEndDate: true,
          ticketingFees: true,
          ticketType: true,
          discountCode: true,
          _count: {
            select: {
              tickets: { where: { order: { status: OrderStatus.COMPLETED } } },
            },
          },
          tickets: {
            where: { order: { status: OrderStatus.PENDING } },
            select: { id: true },
          },
        },
      });

    if (ticketTypesData.length === 0) {
      const eventExists = await prisma.events.count({ where: { id: eventId } });
      if (eventExists === 0) {
        return res
          .status(404)
          .json({ message: `Event with ID ${eventId} not found.` });
      }
    }

    const now = new Date();
    const tickets: CheckoutTicket[] = ticketTypesData.map((tt) => {
      const completedOrdersCount = tt._count.tickets;
      const pendingOrdersCount = tt.tickets.length;
      const stock = Math.max(
        0,
        tt.quantity - completedOrdersCount - pendingOrdersCount
      );
      const saleIsActive = now >= tt.saleStartDate && now <= tt.saleEndDate;

      const maxAllowedToAdd = saleIsActive
        ? Math.max(0, Math.min(stock, tt.maxPurchasePerUser))
        : 0;
      const ticketQuanityLow = stock < 10;
      const fees =
        tt.ticketingFees === TicketFeeStructure.PASS_TICKET_FEES
          ? calculateFees(tt.price)
          : 0;

      return {
        id: tt.id,
        name: tt.name,
        description: tt.description,
        price: tt.price,
        saleStartDate: tt.saleStartDate.toISOString(),
        saleEndDate: tt.saleEndDate.toISOString(),
        maxAllowedToAdd: maxAllowedToAdd,
        fees: fees,
        feeStructure: tt.ticketingFees,
        ticketType: tt.ticketType,
        ticketQuanityLow: ticketQuanityLow,
      } as CheckoutTicket;
    });

    const responseData: CheckoutConfigResponse = {
      tickets: tickets,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(
      `Error fetching checkout config for event ${eventId}:`,
      error
    );
    return res.status(500).json({
      message: 'Internal Server Error fetching checkout configuration.',
    });
  }
}
