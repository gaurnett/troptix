import * as React from 'react';
import { format } from 'date-fns';
import { FetchedOrder } from '../page'; // Import the shared type
import { Separator } from '@/components/ui/separator';
// import { Badge } from '@/components/ui/badge'; // Removed Badge import
// import StatusBadge from './StatusBadge'; // Removed StatusBadge import

interface OrderDetailsProps {
  order: FetchedOrder;
}

// Helper function to format currency (could be moved to a shared utils file)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // TODO: Make currency dynamic
  }).format(amount);
};

// Helper function to format date (could be moved to a shared utils file)
const formatDate = (date: Date | null): string => {
  return date ? format(new Date(date), 'PPP p') : 'N/A'; // Format: Sep 15, 2023 4:30 PM
};

// Helper function to format name
const formatName = (
  firstName: string | null,
  lastName: string | null
): string => {
  return [firstName, lastName].filter(Boolean).join(' ') || 'N/A';
};

// Helper to format address
const formatAddress = (order: FetchedOrder): string | null => {
  const parts = [
    order.billingAddress1,
    order.billingAddress2,
    order.billingCity,
    order.billingState,
    order.billingZip,
    order.billingCountry,
  ].filter(Boolean); // Filter out null/empty strings
  return parts.length > 0 ? parts.join(', ') : null;
};

export default function OrderDetails({ order }: OrderDetailsProps) {
  const billingAddress = formatAddress(order);

  return (
    <div className="space-y-4 py-4 text-sm">
      {/* Purchaser Details */}
      <section>
        <h3 className="font-semibold mb-2">Purchaser Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="font-medium">Name:</div>
          <div>{formatName(order.firstName, order.lastName)}</div>

          <div className="font-medium">Email:</div>
          <div>{order.email || 'N/A'}</div>

          {order.telephoneNumber && (
            <>
              <div className="font-medium">Phone:</div>
              <div>{order.telephoneNumber}</div>
            </>
          )}

          {billingAddress && (
            <>
              <div className="font-medium">Billing Address:</div>
              <div>{billingAddress}</div>
            </>
          )}
        </div>
      </section>

      <Separator />

      {/* Order Summary */}
      <section>
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="font-medium">Order ID:</div>
          <div className="font-mono">{order.id}</div>

          <div className="font-medium">Date Purchased:</div>
          <div>{formatDate(order.createdAt)}</div>

          <div className="font-medium">Total Amount:</div>
          <div className="font-semibold">{formatCurrency(order.total)}</div>
        </div>
      </section>

      <Separator />

      {/* Ticket Breakdown */}
      <section>
        <h3 className="font-semibold mb-2">Tickets Purchased</h3>
        {order.tickets.length > 0 ? (
          <ul className="space-y-1">
            {order.tickets.map((ticket) => (
              <li key={ticket.id} className="flex justify-between items-center">
                <span>
                  {ticket.ticketType?.name || 'Unknown Ticket Type'} (x1)
                </span>
                <span className="font-medium">
                  {ticket.ticketType?.price != null
                    ? formatCurrency(ticket.ticketType.price)
                    : 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No ticket details available for this order.
          </p>
        )}
      </section>

      {/* TODO: Add Payment Details section once Stripe info is available */}
    </div>
  );
}
