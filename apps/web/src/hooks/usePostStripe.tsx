import { useMutation } from '@tanstack/react-query';
import { Charge } from './types/Charge';
import { Checkout } from './types/Checkout';

export enum PostStripeType {
  CREATE_CHARGE = 'CREATE_CHARGE',
}

export interface PostStripeRequest {
  type: keyof typeof PostStripeType;
  charge?: Charge;
}

export interface PaymentIntent {
  paymentId: string;
  clientSecret: string;
  ephemeralKey: string;
  customerId: string;
  currentTabIndex?: number;
  error?: Error;
}

export interface InitializeStripeDetailsResponse {
  currentTabIndex?: number;
  clientSecret?: string;
  orderId?: string;
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: ({ checkout }: { checkout: Checkout }) =>
      createPaymentIntent({ checkout }),
  });
}

function createCharge(checkout: Checkout): Charge {
  const totalPrice = checkout?.total as number;
  const total = totalPrice * 100;

  const charge: Charge = {
    total: Math.round(total),
    userId: checkout.userId as string,
    name: checkout?.firstName + ' ' + checkout?.lastName,
    email: checkout.email,
  };
  return charge;
}

async function createPaymentIntent({ checkout }: { checkout: Checkout }) {
  return postStripe({
    type: PostStripeType.CREATE_CHARGE,
    charge: createCharge(checkout),
  });
}

export async function postStripe({
  type,
  charge,
}: PostStripeRequest): Promise<PaymentIntent> {
  try {
    let url = `/api/stripe`;
    const request = { type, charge };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error in postStripe:', error);
    throw error;
  }
}
