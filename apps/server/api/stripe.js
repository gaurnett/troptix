import { allowCors } from '../lib/auth';
import { sendEmailToUser } from '../lib/emailHelper';
import {
  getBuffer,
  updateSuccessfulOrder,
  updateTicketTypeQuantitySold,
} from '../lib/orderHelper';
import prisma from '../prisma/prisma';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_CHARGE_SUCCEEDED_WEBHOOK;
// const endpointSecret = 'whsec_570f36e545a3bc4d66bf9501ae42327ebb200303a4d9068d39bb7821e48b50ff';

// stripe trigger payment_intent.succeeded
// stripe listen --forward-to localhost:3001/api/stripe

async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response
      .status(500)
      .json({ error: 'No method found for stripe endpoint' });
  }

  switch (method) {
    case 'POST':
      return postOrders(request, response);
    case 'OPTIONS':
      return response.status(200).end();
    default:
      return response.status(500).json('No type set');
  }
}

module.exports = allowCors(handler);

async function postOrders(request, response) {
  const { body, headers } = request;

  if (body === undefined || body.type === undefined) {
    return response
      .status(500)
      .json({ error: 'No body found in post orders request' });
  }

  const postOrderType = body.type;

  switch (String(postOrderType)) {
    case 'CREATE_CHARGE':
      return createCharge(body, response);
    case 'payment_intent.succeeded':
      return stripePaymentIntentSucceeded(body, headers, request, response);
    case 'payment_intent.payment_failed':
      return stripePaymentIntentFailed(body, headers, request, response);
    default:
      return response.status(500).json({ error: 'No post order type set' });
  }
}

async function createCharge(body, response) {
  const charge = body.charge;

  if (charge === undefined || charge.total === undefined) {
    return response
      .status(500)
      .json({ error: 'No body found in create charge request' });
  }

  try {
    var customerId = '';

    if (charge.userId === undefined) {
      const customer = await stripe.customers.create({
        name: charge?.name,
        email: charge?.email,
      });
      customerId = customer.id;
    } else {
      const user = await prisma.users.findUnique({
        where: {
          id: charge.userId,
        },
      });

      if (!user.stripeId) {
        const customer = await stripe.customers.create({
          name: charge?.name,
          email: charge?.email,
        });
        await prisma.users.update({
          where: {
            id: charge.userId,
          },
          data: {
            stripeId: customer.id,
          },
        });

        customerId = customer.id;
      } else {
        customerId = user.stripeId;
      }
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2020-08-27' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: charge.total,
      currency: 'usd',
      customer: customerId,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    response.json({
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customerId: customerId,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error });
  }
}

async function stripePaymentIntentFailed(body, headers, request, response) {
  console.log(body);

  return response.status(200).json({ message: 'Payment intent failed' });
}

async function stripePaymentIntentSucceeded(body, headers, request, response) {
  let event = body;
  if (endpointSecret) {
    const signature = headers['stripe-signature'];
    const buf = await getBuffer(request);
    try {
      event = stripe.webhooks.constructEvent(buf, signature, endpointSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.status(400).json({ error: 'Web failed: ' + err.message });
    }
  }

  const data = event.data.object;

  const paymentMethod = await stripe.paymentMethods.retrieve(
    data.payment_method
  );

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(
        `Payment intent attached for ${paymentIntent.id} ${paymentIntent.amount} was successful!`
      );
      return updateOrderAfterPaymentSucceeds(
        paymentIntent.id,
        paymentMethod,
        response
      );
    case 'payment_method.failed':
      const paymentFailed = event.data.object;
      console.log(
        `attached for ${paymentFailed.id} ${paymentFailed.amount} was successful!`
      );
      break;
    case 'payment_method.canceled':
      const paymentCanceled = event.data.object;
      console.log(
        `attached for ${paymentMethod.id} ${paymentCanceled.amount} was successful!`
      );
      break;
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      console.log(
        `Charge succeeded for ${chargeSucceeded.id} ${chargeSucceeded.amount} was successful!`
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response
    .status(200)
    .json({ message: 'Payment succeeded and tickets added to database' });
}

async function updateOrderAfterPaymentSucceeds(id, paymentMethod, response) {
  try {
    await prisma.orders.update({
      where: {
        stripePaymentId: id,
      },
      data: updateSuccessfulOrder(paymentMethod),
      include: {
        tickets: true,
      },
    });

    const order = await prisma.orders.findUnique({
      where: {
        stripePaymentId: id,
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          },
        },
        event: true,
      },
    });

    console.log(order);

    const orderMap = new Map();
    order.tickets.forEach((ticket) => {
      const ticketId = ticket.ticketType.id;
      if (orderMap.has(ticketId)) {
        const order = orderMap.get(ticketId);
        orderMap.set(ticketId, {
          ...order,
          ticketQuantity: order.ticketQuantity + 1,
          ticketTotalPaid: order.ticketTotalPaid + ticket.total,
        });
      } else {
        orderMap.set(ticketId, {
          ticketQuantity: 1,
          ticketName: ticket.ticketType.name,
          ticketTotalPaid: ticket.total,
        });
      }
    });

    console.log(orderMap);

    for (let [key, value] of orderMap) {
      const updatedTicket = await prisma.ticketTypes.update({
        where: {
          id: key,
        },
        data: updateTicketTypeQuantitySold(value.ticketQuantity),
      });
      console.log(updatedTicket);
    }

    const mailResponse = await sendEmailToUser(order, orderMap);

    console.log('mail response: ' + JSON.stringify(mailResponse));

    return response.status(200).json({ message: 'Updated order successfully' });
  } catch (e) {
    console.log('Error: ' + e);
    return response.status(500).json({ error: 'Error fetching posts' });
  }
}
