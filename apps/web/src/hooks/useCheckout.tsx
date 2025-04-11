import { useMutation } from '@tanstack/react-query';

import { UserDetailsFormData } from '@/lib/schemas/checkoutSchema';
import { ValidationResponse } from '@/types/IntiateCheckout';

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
  });
}
