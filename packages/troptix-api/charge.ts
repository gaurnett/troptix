import { Order } from "../troptix-models";
import { TropTixResponse, prodUrl } from "./api";

export async function createCharge(amount, userId): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();

  try {
    const response = await fetch(prodUrl + '/api/create-charge', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        userId: userId,
      })
    });
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}

export async function createOrder(order: Order): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();

  order.tickets.forEach(ticket => {
    delete ticket.orderId;
  })

  try {
    const response = await fetch(prodUrl + '/api/create-order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: order
      })
    });
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}

export async function getOrders(id: String): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();

  try {
    const response = await fetch(prodUrl + '/api/get-orders?id=' + id);
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}