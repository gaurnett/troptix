import { TropTixResponse, prodUrl } from './api';
import { Order, Charge, ComplementaryOrder } from '../troptix-models';

export enum GetOrdersType {
  GET_ORDERS_FOR_USER = 'GET_ORDERS_FOR_USER',
  GET_ORDER_BY_ID = 'GET_ORDER_BY_ID',
  GET_ORDERS_FOR_EVENT = 'GET_ORDERS_FOR_EVENT',
}

export interface GetOrdersRequest {
  getOrdersType: GetOrdersType;
  eventId?: string;
  userId?: string;
  orderId?: string;
}

export enum PostOrdersType {
  POST_ORDERS_CREATE_CHARGE = 'POST_ORDERS_CREATE_CHARGE',
  POST_ORDERS_CREATE_ORDER = 'POST_ORDERS_CREATE_ORDER',
  POST_ORDERS_CREATE_COMPLEMENTARY_ORDER = 'POST_ORDERS_CREATE_COMPLEMENTARY_ORDER',
}

export interface PostOrdersRequest {
  type: PostOrdersRequest;
  order?: Order;
  charge?: Charge;
  complementaryOrder?: ComplementaryOrder;
}

export async function getOrders(
  request: GetOrdersRequest
): Promise<TropTixResponse> {
  let url = prodUrl + `/api/orders?getOrdersType=${request.getOrdersType}`;
  switch (request.getOrdersType) {
    case GetOrdersType.GET_ORDERS_FOR_USER:
      url += `&id=${request.userId}`;
      break;
    case GetOrdersType.GET_ORDER_BY_ID:
      url += `&id=${request.orderId}`;
      break;
    case GetOrdersType.GET_ORDERS_FOR_EVENT:
      url += `&id=${request.eventId}`;
      break;
  }

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
  });
  const json = await response.json();

  return json;
}

export async function postOrders(
  request: PostOrdersRequest
): Promise<TropTixResponse> {
  let url = prodUrl + `/api/orders`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  const json = await response.json();

  return json;
}
