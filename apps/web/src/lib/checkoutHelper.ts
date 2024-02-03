import { Checkout, CheckoutTicket } from "@/hooks/types/Checkout";
import { Promotion } from "@/hooks/types/Promotion";
import { TicketType } from "@/hooks/types/Ticket";
import { calculateFees, normalizePrice } from "./utils";

export function updateTicketQuantities(checkout: Checkout, ticketType: TicketType, promotion: Promotion, quantity: number): Checkout {
  const ticketTypeId = ticketType.id as string;
  const ticket = checkout.tickets.get(ticketTypeId);

  if (!ticket) {
    return checkout;
  }

  const price = normalizePrice(ticket.subtotal);
  var ticketSubtotal = price;
  var ticketFees =
    ticketType.ticketingFees === 'PASS_TICKET_FEES' ? calculateFees(price) : 0;

  const updatedTickets = checkout.tickets;
  if (checkout.tickets.has(ticketTypeId)) {
    const checkoutTicket = checkout.tickets.get(ticketTypeId) as CheckoutTicket;
    const quantitySelected = checkoutTicket.quantitySelected;
    checkoutTicket.quantitySelected = quantitySelected - quantity;

    if (checkoutTicket.quantitySelected === 0) {
      updatedTickets.delete(ticketTypeId);
    } else {
      updatedTickets.set(ticketTypeId, checkoutTicket);
    }
  }

  var currentSubtotal = checkout.subtotal as number
  var checkoutSubtotal = currentSubtotal - (ticketSubtotal * quantity);
  var checkoutFees = normalizePrice(checkout.fees) - (ticketFees * quantity);
  var checkoutTotal = normalizePrice(checkoutSubtotal + checkoutFees);

  checkout = {
    ...checkout,
    tickets: updatedTickets,
    total: checkoutTotal,
    fees: checkoutFees,
    subtotal: checkoutSubtotal,
  }

  return checkout;
}

function getPromotionPrice(checkout: Checkout, promotion: Promotion, price: number) {
  const promotionValue = promotion.value as number;
  if (checkout.promotionApplied && promotion) {
    switch (promotion.promotionType) {
      case 'PERCENTAGE':
        return price - price * (promotionValue / 100);
      case 'DOLLAR_AMOUNT':
        return price - promotionValue;
    }
  }

  return price;
}