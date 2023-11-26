import _ from 'lodash';
import { message } from 'antd';
import { useContext, useEffect } from 'react';
import { TropTixContext } from '@/components/WebNavigator';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

export default function PaymentForm({
  orderId,
  completePurchaseClicked,
  setCompletePurchaseClicked }) {
  const stripe = useStripe();
  const elements = useElements();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  console.log(orderId);

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
        console.log(error);
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