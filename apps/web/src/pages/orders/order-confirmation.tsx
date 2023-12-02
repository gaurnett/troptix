import { Spinner } from '@/components/ui/spinner';
import { StripeError, loadStripe } from '@stripe/stripe-js';
import { Button, Result, message } from "antd";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(stripeKey ? stripeKey : "");

export default function OrderConfirmation() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const clientSecret = router.query.payment_intent_client_secret as string;
  const [stripeError, setStripeError] = useState<StripeError>();
  const [fetchingStatus, setFetchingStatus] = useState(true);

  useEffect(() => {
    async function getStripeStatus() {
      const stripe = await stripePromise;
      if (!stripe) {
        messageApi
          .error({
            key: 'process-payment-loading',
            content: 'There was an error loading order status',
          });
        return;
      }

      if (!clientSecret) {
        // router.push('/');
        return;
      }

      stripe.retrievePaymentIntent(clientSecret)
        .then(paymentIntent => {
          if (paymentIntent.error) {
            setStripeError(paymentIntent?.error);
          }
          setFetchingStatus(false);
        })
    }

    getStripeStatus();
  }, [clientSecret, messageApi, router]);

  if (fetchingStatus) {
    return (
      <div className="mt-32">
        <Spinner text={"Fetching Order Status"} />
      </div>
    )
  }

  if (stripeError) {
    return (
      <div className="mt-32 w-full md:max-w-2xl mx-auto">
        {contextHolder}
        <Result
          status="error"
          title="Payment Failed"
          subTitle={`Order number: ${orderId}. Please retry again or reach out to our team with the order number`}
          extra={[
            <Link
              href={{ pathname: "/contact", query: { orderId } }}
              target="_blank"
              key={"contact"}>
              <Button
                type='primary'
                className="bg-blue-600 hover:bg-blue-700 mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                Contact Us
              </Button>
            </Link>,
          ]}
        />
      </div>
    )
  }

  return (
    <div className="mt-32 w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <Result
        status="success"
        title="Ticket Purchase Successful!"
        subTitle={`Order number: ${orderId}. Please check your email for an order confirmation within 5 minutes. View your order details below to see and update ticket names.`}
        extra={[
          <Link
            href={{ pathname: "/order-details", query: { orderId } }}
            key={"tickets"}>
            <Button
              type='primary'
              className="bg-blue-600 hover:bg-blue-700 mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
              View Order Details & Tickets
            </Button>
          </Link>
        ]}
      />

    </div>
  );
}