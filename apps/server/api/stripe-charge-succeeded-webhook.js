import { getBuffer } from "../lib/orderHelper";
import { updateSuccessfulOrder } from "../lib/orderHelper";

import prisma from "../prisma/prisma";
// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = process.env.STRIPE_TEST_CHARGE_SUCCEEDED_WEBHOOK;
// const endpointSecret = 'whsec_570f36e545a3bc4d66bf9501ae42327ebb200303a4d9068d39bb7821e48b50ff';

export default async function handler(request, response) {

  let event = request.body;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    const buf = await getBuffer(request);
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.status(400).json({ error: "Web failed" });
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`Payment succeeded for ${paymentIntent.id} ${paymentIntent.amount} was successful!`);
      return updateOrderAfterPayment(paymentIntent.id, response);
    case 'payment_method.failed':
      const paymentFailed = event.data.object;
      console.log(`attached for ${paymentFailed.id} ${paymentFailed.amount} was successful!`);
      break;
    case 'payment_method.canceled':
      const paymentCanceled = event.data.object;
      console.log(`attached for ${paymentMethod.id} ${paymentCanceled.amount} was successful!`);
      break;
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      console.log(`Charge succeeded for ${chargeSucceeded.id} ${chargeSucceeded.amount} was successful!`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).json({ message: "Payment succeeded and tickets added to database" });
}

async function updateOrderAfterPayment(id, response) {
  try {
    await prisma.orders.update({
      where: {
        id: id,
      },
      data: updateSuccessfulOrder(),
      include: {
        tickets: true
      }
    });

    return response.status(200).json({ message: "Updated order successfully" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching posts' });
  }
}