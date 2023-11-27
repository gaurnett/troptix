import { TropTixContext } from '@/components/WebNavigator';
import { Spinner } from '@/components/ui/spinner';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { PostOrdersType, postOrders } from 'troptix-api';
import { Charge, Order } from 'troptix-models';
import PaymentForm from './payment-form';
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(stripeKey ? stripeKey : "");

export default function CheckoutForm({
  checkout,
  event,
  completePurchaseClicked,
  setCompletePurchaseClicked,
  setIsStripeLoaded }) {

  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? undefined : user.id;
  const [fetchingStripeDetails, setFetchingStripeDetails] = useState(true);
  const [options, setOptions] = useState<any>();
  const [orderId, setOrderId] = useState("");
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const handleComplete = () => setIsComplete(true);

    async function fetchPaymentSheetParams() {
      const charge = new Charge();
      charge.total = checkout.promotionApplied
        ? Math.trunc(checkout.discountedTotal * 100) : Math.trunc(checkout.total * 100);
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
        return;
      }

      const order = new Order(checkout, paymentId, event.id, userId, customerId);

      setOptions({
        clientSecret: clientSecret,
        onComplete: handleComplete,
        appearance: {/*...*/ },
      })

      setOrderId(order.id);

      try {
        const postOrdersRequest = {
          type: PostOrdersType.POST_ORDERS_CREATE_ORDER,
          order: order
        }
        await postOrders(postOrdersRequest);
      } catch (error) {
        return;
      }

      setFetchingStripeDetails(false);
      setIsStripeLoaded(true);

      return paymentId;
    };

    initializePaymentSheet();

  }, [checkout, event.id, setIsStripeLoaded, userId]);

  useEffect(() => {
    if (isComplete) {
      router.push({ pathname: "/order-confirmation", query: { orderId: orderId } })
    }
  }, [isComplete, orderId, router]);

  return (
    <div className="w-full md:max-w-2xl mx-auto h-full overflow-x-hidden overflow-y-auto	">
      <div className='flex flex-col h-full'>
        {
          fetchingStripeDetails ?
            <div className="mt-32">
              <Spinner text={"Initializing Card Detail"} />
            </div>
            :
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                orderId={orderId}
                completePurchaseClicked={completePurchaseClicked}
                setCompletePurchaseClicked={setCompletePurchaseClicked} />
            </Elements>
        }
      </div>
    </div>
  );
}