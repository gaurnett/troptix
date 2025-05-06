import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'sonner';

interface PaymentFormProps {
  orderId: string;
  completePurchaseClicked: boolean;
  setCompletePurchaseClicked: Dispatch<SetStateAction<boolean>>;
}

export default function PaymentForm({
  orderId,
  completePurchaseClicked,
  setCompletePurchaseClicked,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    async function completeStripePurchase() {
      if (!stripe || !elements) {
        return;
      }

      const toastId = toast.loading('Processing Payment...', {
        description: 'Please wait while we confirm your payment.',
        id: 'process-payment-loading',
      });

      const url = window.location.origin;

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: url + `/orders/order-confirmation?orderId=${orderId}`,
        },
      });

      toast.dismiss(toastId);

      if (error) {
        toast.error('Payment Failed', {
          description: error.message
            ? error.message
            : 'Your card could not be authorized. Please try again, or contact your card issuer.',
          id: 'process-payment-error',
          duration: 3,
        });
      } else {
        toast.success('Payment Successful', {
          description: 'Redirecting to confirmation page...',
          id: 'process-payment-success',
        });
      }

      setCompletePurchaseClicked(false);
    }

    if (completePurchaseClicked) {
      completeStripePurchase();
    }
  }, [
    completePurchaseClicked,
    elements,
    orderId,
    setCompletePurchaseClicked,
    stripe,
  ]);

  return (
    <div className="h-full w-full md:max-w-2xl mx-auto mb-6">
      <PaymentElement className="grow h-full overflow-hidden p-2" />
    </div>
  );
}
