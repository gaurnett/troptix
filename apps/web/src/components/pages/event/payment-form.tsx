import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PaymentForm({
  orderId,
  completePurchaseClicked,
  setCompletePurchaseClicked }) {
  const stripe = useStripe();
  const elements = useElements();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    async function completeStripePurchase() {
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      messageApi
        .open({
          key: 'process-payment-loading',
          type: 'loading',
          content: 'Processing Payment..',
          duration: 0,
        });

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        redirect: "if_required",
      });

      messageApi.destroy('process-payment-loading');
      if (error) {
        messageApi.error("There was an error processing your payment.")
      } else {
        messageApi.open({
          type: "success",
          content: "Ticket purchase successful.",
          duration: 1.5
        }).then(() => {
          router.push({ pathname: "/order-confirmation", query: { orderId: orderId } })
        });

        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }

      setCompletePurchaseClicked(false);
    }

    if (completePurchaseClicked) {
      completeStripePurchase();
    }

  }, [completePurchaseClicked, elements, messageApi, orderId, router, setCompletePurchaseClicked, stripe])

  return (
    <div className="h-full w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <PaymentElement className='grow h-full' />
    </div>
  );
}