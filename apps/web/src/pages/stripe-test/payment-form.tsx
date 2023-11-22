import _ from 'lodash';
import { message, Button, Spin, Modal, List, Steps, theme, Form } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Event, getEventsFromRequest, Checkout, Order, Charge } from 'troptix-models';
import { postOrders, PostOrdersType, PostOrdersRequest, getEvents, saveEvent, GetEventsRequest, GetEventsType } from 'troptix-api';
import CheckoutForms from './tickets-checkout-forms';
import { TropTixContext } from '@/components/WebNavigator';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_TEST_KEY
const stripePromise = loadStripe(stripeKey ? stripeKey : "");

export default function PaymentForm() {
  const { token } = theme.useToken();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const router = useRouter();
  const [fetchingStripeDetails, setFetchingStripeDetails] = useState(true);
  const [options, setOptions] = useState<any>();

  async function onFinish(values: any) {

    // We don't want to let default form submission happen here,
    // which would refresh the page.
    // event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'https://tailwindcss.com/docs/text-color',
      },
    });


    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      console.log(error)
      // setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }

  const onFinishFailed = (errorInfo: any) => {
  };

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <PaymentElement />
        <Button type='primary' htmlType='submit' className="px-4 py-4 shadow-md items-center bg-blue-600 hover:bg-blue-700 font-medium inline-flex">Purchase Tickets</Button>
      </Form>
    </div>
  );
}