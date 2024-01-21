import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { message, notification } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PaymentForm({
  orderId,
  completePurchaseClicked,
  setCompletePurchaseClicked,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  function openNotification(message: string | undefined) {
    notification.error({
      message: `Payment Failed`,
      description: message
        ? message
        : 'Your card could not be authorized. Please try again, or contact your card issuer for further details.',
      placement: 'bottom',
      duration: 0,
    });
  }

  useEffect(() => {
    async function completeStripePurchase() {
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      messageApi.open({
        key: 'process-payment-loading',
        type: 'loading',
        content: 'Processing Payment..',
        duration: 0,
      });

      const url = window.location.origin;

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: url + `/orders/order-confirmation?orderId=${orderId}`,
        },
      });

      messageApi.destroy('process-payment-loading');
      if (error) {
        openNotification(error.message);
      } else {
        messageApi.open({
          type: 'success',
          content: 'Ticket purchase successful.',
          duration: 1.5,
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
    messageApi,
    orderId,
    router,
    setCompletePurchaseClicked,
    stripe,
  ]);

  return (
    <div className="h-full w-full md:max-w-2xl mx-auto mb-6">
      {contextHolder}
      <PaymentElement className="grow h-full overflow-hidden p-2" />
    </div>
  );
}
