import { useMutation } from "@tanstack/react-query";
import { Charge } from "./types/Charge";
import { Checkout } from "./types/Checkout";
import { prodUrl } from "./useFetchEvents";

export enum PostStripeType {
  CREATE_CHARGE = "CREATE_CHARGE",
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
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: ({
      checkout,
    }: {
      checkout: Checkout;
    }) => createPaymentIntent({ checkout })
  });
}

function createCharge(checkout: Checkout): Charge {
  const total = checkout.promotionApplied
    ? checkout.discountedTotal * 100
    : checkout.total * 100;
  const charge: Charge = { total, userId: checkout.userId };
  return charge;
}

async function createPaymentIntent({
  checkout,
}: {
  checkout: Checkout;
}) {
  return postStripe({
    type: PostStripeType.CREATE_CHARGE,
    charge: createCharge(checkout),
  });
}

export async function postStripe({ type, charge }: PostStripeRequest): Promise<PaymentIntent> {
  try {
    let url = prodUrl + `/api/stripe`;
    const request = { type, charge };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error in postStripe:", error);
    throw error;
  }
}
