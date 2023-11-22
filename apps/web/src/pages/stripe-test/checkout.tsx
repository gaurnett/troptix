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
import PaymentForm from './payment-form';
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_TEST_KEY
const stripePromise = loadStripe(stripeKey ? stripeKey : "");

export default function CheckoutForm({ checkout, event }) {
  const { token } = theme.useToken();
  const [errorMessage, setErrorMessage] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const router = useRouter();
  const [fetchingStripeDetails, setFetchingStripeDetails] = useState(true);
  const [options, setOptions] = useState<any>();

  useEffect(() => {
    async function fetchPaymentSheetParams() {
      const charge = new Charge();
      charge.total = checkout.promotionApplied ? checkout.discountedTotal * 100 : checkout.total * 100;
      charge.userId = user.id;

      const postOrdersRequest = {
        type: PostOrdersType.POST_ORDERS_CREATE_CHARGE,
        charge: charge
      }

      const response = await postOrders(postOrdersRequest);
      const { paymentId, paymentIntent, ephemeralKey, customer } = await response;

      return {
        paymentId,
        paymentIntent,
        ephemeralKey,
        customer,
      };
    };

    async function initializePaymentSheet() {
      const {
        paymentId,
        paymentIntent
      } = await fetchPaymentSheetParams();

      console.log("Secret: " + paymentIntent);
      setOptions({
        clientSecret: paymentIntent,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
      })

      const order = new Order(checkout, paymentId, event.id, user.id);
      console.log(order);

      try {
        const postOrdersRequest = {
          type: PostOrdersType.POST_ORDERS_CREATE_ORDER,
          order: order
        }
        await postOrders(postOrdersRequest);
      } catch (error) {
        console.log("[openStripePayment] create order error: " + error);
        return;
      }

      setFetchingStripeDetails(false);

      return paymentId;
    };

    initializePaymentSheet();

  }, [checkout, checkout.discountedTotal, checkout.promotionApplied, checkout.total, event.id, user.id]);

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <div>
        {
          fetchingStripeDetails ? <></> :
            <Elements stripe={stripePromise} options={options}>
              <div>Hello</div>
              <PaymentForm />
            </Elements>
        }
      </div>
    </div>
  );
}