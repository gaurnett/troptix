import { CustomInput } from '@/components/ui/input';
import { AddressElement, PaymentElement, PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PaymentForm({
  orderId,
  completePurchaseClicked,
  setCompletePurchaseClicked }) {
  const stripe = useStripe();
  const elements = useElements();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Demo total',
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

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

      const url = window.location.origin;
      console.log("URL: " + url);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: url + `/orders/order-confirmation?orderId=${orderId}`
        }
      });

      messageApi.destroy('process-payment-loading');
      if (error) {
        messageApi.error("There was an error processing your payment.")
      } else {
        messageApi.open({
          type: "success",
          content: "Ticket purchase successful.",
          duration: 1.5
        })

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

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />
  }

  return (
    <div className="h-full w-full md:max-w-2xl mx-auto mb-6">
      {contextHolder}
      <div className="flex justify-between">
        <div className="mb-4 mr-1 md:mr-4 w-full">
          <CustomInput value={"he;;p"} name={"name"} id={"name"} label={"Name *"} type={"text"} placeholder={"John Doe"} handleChange={undefined} required={true} />
        </div>
      </div>
      <AddressElement className='px-2' options={{ mode: 'billing' }} />
      <PaymentElement className='grow h-full overflow-hidden px-2' />
    </div>
  );
}