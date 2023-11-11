import prisma from "../prisma/prisma";
import { getPrismaCreateOrderQuery } from "../lib/eventHelper";
import { getBuffer, updateSuccessfulOrder } from "../lib/orderHelper";
import { sendEmailToUser } from "../lib/emailHelper";

const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
// const endpointSecret = process.env.STRIPE_TEST_CHARGE_SUCCEEDED_WEBHOOK;
const endpointSecret = 'whsec_570f36e545a3bc4d66bf9501ae42327ebb200303a4d9068d39bb7821e48b50ff';

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for users endpoint' });
  }

  switch (method) {
    case "POST":
      return postOrders(request, response);
    case "GET":
      const getOrderType = request.query.getOrdersType;
      const id = request.query.id;
      return getOrders(getOrderType, id, response);
    case "PUT":
      break;
    case "DELETE":
      break;
    default:
      break;
  }
}

async function postOrders(request, response) {
  const { body, headers } = request;

  if (body === undefined || body.type === undefined) {
    return response.status(500).json({ error: 'No body found in post orders request' });
  }

  const postOrderType = body.type;

  switch (String(postOrderType)) {
    case 'POST_ORDERS_CREATE_CHARGE':
      return createCharge(body, response);
    case 'POST_ORDERS_CREATE_ORDER':
      return createOrder(body, response);
    case 'payment_intent.succeeded':
      return stripePaymentIntentSucceeded(body, headers, request, response);
    default:
      return response.status(500).json({ error: 'No post order type set' });
  }
}

async function createCharge(body, response) {
  const charge = body.charge;

  if (charge === undefined || charge.total === undefined || charge.userId === undefined) {
    return response.status(500).json({ error: 'No body found in create charge request' });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: charge.userId,
      },
    });

    var customerId = "";
    if (user.stripeId === null || user.stripeId === undefined || user.stripeId === "") {
      const customer = await stripe.customers.create();
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
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      publishableKey: 'pk_test_51Noxs0FEd6UvxBWGgUgu6JQw6VnDqC8ei9YkxAthxkjGBsAY3OKEKbkuRlnCTcHoVnQp5vvCrM0YfuhSFQZv3wR300x6wKe6oJ'
    });

  } catch (error) {
    return response.status(500).json({ error: error });
  }
}

async function createOrder(body, response) {
  const order = body.order;

  if (order === undefined) {
    return response.status(500).json({ error: 'No order found in create order request' });
  }

  try {
    const event = await prisma.orders.create({
      data: getPrismaCreateOrderQuery(order),
      include: {
        tickets: true,
      }
    });

    return response.status(200).json({ error: null, message: "Successfully added order" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding order' });
  }

}

async function stripePaymentIntentSucceeded(body, headers, request, response) {
  let event = body;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = headers['stripe-signature'];
    const buf = await getBuffer(request);
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.status(400).json({ error: "Web failed: " + err.message });
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      return updateOrderAfterPaymentSucceeds(paymentIntent.id, response);
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

async function updateOrderAfterPaymentSucceeds(id, response) {
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

    // const email = await sendEmailToUser(response);
    // console.log("Email: " + email);

    return response.status(200).json({ message: "Updated order successfully" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching posts' });
  }
}

async function getOrders(getOrderType, id, response) {
  switch (String(getOrderType)) {
    case 'GET_ORDERS_FOR_USER': // GetOrdersType.GET_ORDERS_FOR_USER
      return getOrdersForUser(response, id);
    case 'GET_ORDER_BY_ID': // GetOrdersType.GET_ORDER_BY_ID
      return getOrderById(response, id);
    case 'GET_ORDERS_FOR_EVENT': // GetOrdersType.GET_ORDERS_FOR_EVENT
      return getOrdersForEvent(response, id);
    default:
      return response.status(500).json({ error: 'No get order type set' });
  }
}

async function getOrdersForUser(response, id) {
  try {
    const user = await prisma.orders.findMany({
      where: {
        userId: id,
        status: 'COMPLETED'
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          }
        },
        event: true
      },
    });
    return response.status(200).json(user);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function getOrderById(response, id) {
  try {
    const user = await prisma.orders.findUnique({
      where: {
        id: id,
        status: 'COMPLETED'
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          }
        },
        event: true
      },
    });
    return response.status(200).json(user);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function getOrdersForEvent(response, id) {
  try {
    const user = await prisma.orders.findMany({
      where: {
        eventId: id,
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          }
        },
        event: true,
        user: true
      },
    });
    return response.status(200).json(user);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}
