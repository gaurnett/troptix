import _ from 'lodash';
import { message, Button, Spin, Modal, List, Steps, theme } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Event, getEventsFromRequest, Checkout, Order, Charge } from 'troptix-models';
import { postOrders, PostOrdersType, PostOrdersRequest, getEvents, saveEvent, GetEventsRequest, GetEventsType } from 'troptix-api';
import CheckoutForms from './tickets-checkout-forms';
import { TropTixContext } from '@/components/WebNavigator';
import { PaymentElement } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_TEST_KEY
const stripePromise = loadStripe(stripeKey ? stripeKey : "");

export default function BillingForm({ checkout }) {
  const { token } = theme.useToken();

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
        paymentIntent,
        ephemeralKey,
        customer,
      } = await fetchPaymentSheetParams();

      console.log("Secret: " + paymentIntent);
      setOptions({
        clientSecret: paymentIntent,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
      })


      setFetchingStripeDetails(false);

      // const { error } = await initPaymentSheet({
      //   merchantDisplayName: "TropTix",
      //   customerId: customer,
      //   customerEphemeralKeySecret: ephemeralKey,
      //   paymentIntentClientSecret: paymentIntent,
      //   allowsDelayedPaymentMethods: true,
      //   defaultBillingDetails: {
      //     name: user.name,
      //     email: user.email,
      //     address: {
      //       line1: checkout.billingAddress1,
      //       line2: checkout.billingAddress2,
      //       city: checkout.billingCity,
      //       state: checkout.billingState,
      //       postalCode: checkout.billingZip,
      //       country: checkout.billingCountry
      //     }
      //   }
      // });

      // console.log(error);

      // if (error) {
      //   console.log("Error: " + error.localizedMessage);
      //   // setLoading(true);
      // }

      return paymentId;
    };
    initializePaymentSheet();

  }, [checkout.discountedTotal, checkout.promotionApplied, checkout.total, user.id]);

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <div>

      </div>
    </div>
  );
}