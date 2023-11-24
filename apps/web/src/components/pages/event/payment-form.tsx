import _ from 'lodash';
import { message } from 'antd';
import { useContext, useEffect } from 'react';
import { TropTixContext } from '@/components/WebNavigator';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

export default function PaymentForm({
  completePurchaseClicked,
  setCompletePurchaseClicked }) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {

    async function completeStripePurchase() {

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
        message.error("There was an error processing your payment.")
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

      setCompletePurchaseClicked(false);
    }

    if (completePurchaseClicked) {
      completeStripePurchase();
    }

  }, [completePurchaseClicked, elements, setCompletePurchaseClicked, stripe])

  return (
    <div className="h-full w-full md:max-w-2xl mx-auto">
      <PaymentElement className='grow h-full' />
    </div>
  );
}