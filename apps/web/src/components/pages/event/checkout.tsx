import _ from 'lodash';
import { message, Button, Spin, Modal, List, Steps, theme, Form } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Event, getEventsFromRequest, Checkout, Order, Charge } from 'troptix-models';
import { postOrders, PostOrdersType, PostOrdersRequest, getEvents, saveEvent, GetEventsRequest, GetEventsType } from 'troptix-api';
import { TropTixContext } from '@/components/WebNavigator';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './payment-form';
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = loadStripe(stripeKey ? stripeKey : "");

export default function CheckoutForm({
  checkout,
  event,
  completePurchaseClicked,
  setCompletePurchaseClicked,
  setIsStripeLoaded }) {

  const [contextHolder] = message.useMessage();
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? undefined : user.id;
  const [fetchingStripeDetails, setFetchingStripeDetails] = useState(true);
  const [options, setOptions] = useState<any>();

  useEffect(() => {
    async function fetchPaymentSheetParams() {
      const charge = new Charge();
      charge.total = checkout.promotionApplied ? checkout.discountedTotal * 100 : checkout.total * 100;
      charge.userId = userId;

      const postOrdersRequest = {
        type: PostOrdersType.POST_ORDERS_CREATE_CHARGE,
        charge: charge
      }

      const response = await postOrders(postOrdersRequest);
      const { paymentId, clientSecret, ephemeralKey, customerId } = await response;

      return {
        paymentId,
        clientSecret,
        ephemeralKey,
        customerId,
      };
    };

    async function initializePaymentSheet() {
      const {
        paymentId,
        clientSecret,
        customerId
      } = await fetchPaymentSheetParams();

      if (paymentId === undefined || paymentId === null || paymentId === "") {
        message.error("There was a problem with your request, please try again later");
        // setCheckoutPreviousButtonClicked();
        return;
      }

      setOptions({
        clientSecret: clientSecret,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
      })

      const order = new Order(checkout, paymentId, event.id, userId, customerId);
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
      setIsStripeLoaded(true);

      return paymentId;
    };

    initializePaymentSheet();

  }, [checkout, checkout.discountedTotal, checkout.promotionApplied, checkout.total, event.id, setIsStripeLoaded, userId]);

  return (
    <div className="w-full md:max-w-2xl mx-auto h-full">
      <div className='flex flex-col h-full'>
        {
          fetchingStripeDetails ?
            <Spin className="mt-32" tip="Initializing Card Details" size="large">
              <div className="content" />
            </Spin> :
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                completePurchaseClicked={completePurchaseClicked}
                setCompletePurchaseClicked={setCompletePurchaseClicked} />
            </Elements>
        }
      </div>
    </div>
  );
}