import { useMutation, useQuery } from '@tanstack/react-query';

import { UserDetailsFormData } from '@/lib/schemas/checkoutSchema';
import { CheckoutConfigResponse, ValidationResponse } from '@/types/checkout';
import { message } from 'antd';

export interface InitiateCheckoutVariables {
  eventId: string;
  selectedTickets: Record<string, number>;
  userDetails: UserDetailsFormData;
  promotionCode?: string;
}

const initiateCheckoutApiCall = async (
  variables: InitiateCheckoutVariables
): Promise<ValidationResponse> => {
  const requestBody = {
    eventId: variables.eventId,
    selectedTickets: variables.selectedTickets,
    userDetails: variables.userDetails,
    promotionCode: variables.promotionCode,
  };

  const response = await fetch('/api/checkout/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || `Checkout initiation failed (${response.status})`
    );
  }

  return responseData as ValidationResponse;
};

/**
 * React Query hook using useMutation to call the checkout initiation endpoint.
 * Handles server-side validation, pending order creation, and Stripe Payment Intent creation.
 *
 * @returns {UseMutationResult<ValidationResponse, Error, InitiateCheckoutVariables>}
 * Includes mutate, data, error, isPending, etc.
 */
export function useInitiateCheckout() {
  return useMutation<ValidationResponse, Error, InitiateCheckoutVariables>({
    mutationFn: initiateCheckoutApiCall,
    onError: (error) => {
      console.error('Initiate Checkout Error:', error);
      message.error('Checkout failed. Please try again.');
    },
  });
}

const fetchCheckoutConfig = async (
  eventId: string
): Promise<CheckoutConfigResponse> => {
  // TODO: Determine if auth is needed for this endpoint
  // const { user } = useContext(TropTixContext); // Get user/token if needed
  // const jwtToken = user?.jwtToken; // Example token retrieval

  if (!eventId) {
    throw new Error('Event ID is required to fetch checkout config.');
  }

  const url = `/api/checkout/config?eventId=${eventId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const responseData = await response.json(); // Always try to parse JSON

  if (!response.ok) {
    throw new Error(
      responseData.message ||
        `Failed to fetch checkout config (${response.status})`
    );
  }

  // Type assertion on success
  return responseData as CheckoutConfigResponse;
};

/**
 * React Query hook to fetch the initial configuration data needed for the
 * checkout UI (available tickets, etc.) for a specific event.
 * Calls GET /api/checkout/config?eventId=...
 *
 * @param {string | undefined} eventId - The ID of the event to fetch config for. Query disabled if falsy.
 * @returns {UseQueryResult<CheckoutConfigResponseDTO, Error>}
 */
export function useFetchCheckoutConfig(eventId: string) {
  return useQuery<CheckoutConfigResponse, Error>({
    queryKey: ['checkout', 'config', eventId], // Query key array
    queryFn: () => fetchCheckoutConfig(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });
}
