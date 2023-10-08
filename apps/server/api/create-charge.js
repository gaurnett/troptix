const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body } = request;

  if (body === undefined || body.total === undefined || body.userId === undefined) {
    return response.status(500).json({ error: 'No body found in POST request' });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: body.userId,
      },
    });

    var customerId = "";
    if (user.stripeId === null || user.stripeId === undefined || user.stripeId === "") {
      const customer = await stripe.customers.create();
      await prisma.users.update({
        where: {
          id: body.userId,
        },
        data: {
          stripeId: customer.id,
        },
      });

      customerId = customer.id;
    } else {
      customerId = user.stripeId;
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2020-08-27' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.total,
      currency: 'usd',
      customer: customerId,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    response.json({
      paymentId: paymentIntent.id,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      publishableKey: 'pk_test_51Noxs0FEd6UvxBWGgUgu6JQw6VnDqC8ei9YkxAthxkjGBsAY3OKEKbkuRlnCTcHoVnQp5vvCrM0YfuhSFQZv3wR300x6wKe6oJ'
    });

  } catch (error) {
    return response.status(500).json({ error: error });
  }

}