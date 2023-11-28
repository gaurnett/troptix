import { Spinner } from '@/components/ui/spinner';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './payment-form';
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(stripeKey ? stripeKey : "");

export default function CheckoutForm({
  orderId,
  clientSecret,
  completePurchaseClicked,
  setCompletePurchaseClicked }) {

  if (!clientSecret) {
    return (
      <div className="mt-32">
        <Spinner text={"Initializing Card Detail"} />
      </div>
    )
  }

  return (
    <div className="w-full md:max-w-2xl mx-auto h-full overflow-x-hidden overflow-y-auto	">
      <div className='flex flex-col h-full'>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret,
            appearance: {/*...*/ },
          }
          }>
          <PaymentForm
            orderId={orderId}
            completePurchaseClicked={completePurchaseClicked}
            setCompletePurchaseClicked={setCompletePurchaseClicked} />
        </Elements>
      </div>
    </div>
  );
}