const stripe = require('stripe')('sk_test_51Noxs0FEd6UvxBWGLBQoJXXpp3tfA45oZcw1oLU4gB2lKN5d4QzssgGS5HL0eYervWi9J2To89PDOTxyZJq8T3f400IcrMYcEg');
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body } = request;

  if (body === undefined || body.amount === undefined || body.userId === undefined) {
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
      amount: body.amount,
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