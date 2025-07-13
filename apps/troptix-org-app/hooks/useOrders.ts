import { useQuery } from '@tanstack/react-query';
import { prodUrl } from './constants';

export enum GetOrdersType {
  GET_ORDERS_FOR_USER = 'GET_ORDERS_FOR_USER',
  GET_ORDER_BY_ID = 'GET_ORDER_BY_ID',
  GET_ORDERS_FOR_EVENT = 'GET_ORDERS_FOR_EVENT',
}

export interface GetOrdersRequest {
  getOrdersType: keyof typeof GetOrdersType;
  id: string;
  email?: string;
  jwtToken?: string;
}

export enum PostOrdersType {
  POST_ORDERS_CREATE_CHARGE = 'POST_ORDERS_CREATE_CHARGE',
  POST_ORDERS_CREATE_ORDER = 'POST_ORDERS_CREATE_ORDER',
  POST_ORDERS_CREATE_COMPLEMENTARY_ORDER = 'POST_ORDERS_CREATE_COMPLEMENTARY_ORDER',
}

export function useFetchOrderById({
  getOrdersType = GetOrdersType.GET_ORDER_BY_ID,
  id,
}: GetOrdersRequest) {
  return useQuery({
    queryKey: ['order', getOrdersType, id],
    queryFn: () => getOrders({ getOrdersType, id }),
  });
}

// fetch the events for a specific event currently
export function useFetchEventOrders(eventId: string) {
  const getOrdersType = GetOrdersType.GET_ORDERS_FOR_EVENT;
  const id = eventId;

  return useQuery({
    queryKey: ['order', getOrdersType, id],
    queryFn: () => getOrders({ getOrdersType, id }),
  });
}

export async function getOrders({ getOrdersType, id }: GetOrdersRequest) {
  try {
    if (!id) {
      throw new Error('user id not defined');
    }
    let url = prodUrl + `/api/orders?getOrdersType=${getOrdersType}&id=${id}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error('Error in getOrders:', error);
    throw error;
  }
}
