import { TropTixContext } from '@/components/WebNavigator';
import { updateTicketQuantities } from '@/lib/checkoutHelper';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { Checkout } from './types/Checkout';
import { Promotion } from './types/Promotion';
import { TicketType } from './types/Ticket';

export enum GetTicketTypesType {
  GET_TICKET_TYPES_FOR_CHECKOUT = 'GET_TICKET_TYPES_FOR_CHECKOUT',
  GET_TICKET_TYPES_BY_EVENT = 'GET_TICKET_TYPES_BY_EVENT',
}

export interface GetTicketTypeRequest {
  getTicketTypesType: keyof typeof GetTicketTypesType;
  eventId?: string;
  jwtToken?: string;
}

export interface CheckOrderValidityResponse {
  valid?: boolean;
  checkout?: Checkout;
  ticketTypes?: TicketType[];
}

export function useFetchTicketTypesByEvent(eventId: string) {
  const { user } = useContext(TropTixContext);
  const getTicketTypesType = GetTicketTypesType.GET_TICKET_TYPES_BY_EVENT;
  const id = eventId;
  const jwtToken = user?.jwtToken;

  return useQuery({
    queryKey: ['order', getTicketTypesType, id],
    queryFn: () => getTicketTypes({ getTicketTypesType, eventId, jwtToken }),
  });
}

export function useFetchTicketTypesForCheckout(eventId: string) {
  const { user } = useContext(TropTixContext);
  const getTicketTypesType = GetTicketTypesType.GET_TICKET_TYPES_FOR_CHECKOUT;
  const id = eventId;
  const jwtToken = user?.jwtToken;

  return useQuery({
    queryKey: ['order', getTicketTypesType, id],
    queryFn: () => getTicketTypes({ getTicketTypesType, eventId, jwtToken }),
  });
}

export async function checkOrderValidity(
  eventId: string,
  jwtToken: string | undefined,
  checkout: Checkout,
  promotion: Promotion
): Promise<CheckOrderValidityResponse> {
  const response: CheckOrderValidityResponse = {};
  const getTicketTypesRequest: GetTicketTypeRequest = {
    getTicketTypesType: GetTicketTypesType.GET_TICKET_TYPES_FOR_CHECKOUT,
    eventId: eventId,
    jwtToken: jwtToken,
  };

  return getTicketTypes(getTicketTypesRequest)
    .then((ticketTypes: TicketType[]) => {
      response.ticketTypes = ticketTypes;
      response.checkout = checkout;

      let validOrder = true;
      for (let ticketType of ticketTypes) {
        const completedOrders = ticketType?.completedOrders as number;
        const pendingOrder = ticketType?.pendingOrders as number;
        const quantity = ticketType?.quantity as number;
        const selectedTicket = checkout.tickets.get(ticketType?.id as string);

        if (selectedTicket) {
          const quantitySelected = selectedTicket.quantitySelected;
          const currentPendingAndSoldTotal = pendingOrder + completedOrders;
          if (currentPendingAndSoldTotal === quantity) {
            validOrder = false;
            const newCheckout = updateTicketQuantities(
              checkout,
              ticketType,
              promotion,
              quantitySelected
            );
            response.checkout = newCheckout;
          } else if (currentPendingAndSoldTotal + quantitySelected > quantity) {
            validOrder = false;
            const newCheckout = updateTicketQuantities(
              checkout,
              ticketType,
              promotion,
              currentPendingAndSoldTotal + quantitySelected - quantity
            );
            response.checkout = newCheckout;
          }
        }
      }

      response.valid = validOrder;
      return response;
    })
    .catch((error) => {
      response.valid = false;
      return response;
    });
}

export async function getTicketTypes({
  getTicketTypesType,
  eventId,
  jwtToken,
}: GetTicketTypeRequest) {
  let url = `/api/ticketTypes?getTicketTypesType=${getTicketTypesType}`;

  switch (getTicketTypesType) {
    case GetTicketTypesType.GET_TICKET_TYPES_FOR_CHECKOUT:
      url += `&eventId=${eventId}`;
      break;
    case GetTicketTypesType.GET_TICKET_TYPES_BY_EVENT:
      url += `&eventId=${eventId}`;
      break;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error('Error in getTicketTypes:', error);
    throw error;
  }
}
