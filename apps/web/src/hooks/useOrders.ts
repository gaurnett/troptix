import { TropTixContext } from '@/components/WebNavigator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { useContext } from 'react';
import { Charge } from './types/Charge';
import { Checkout } from './types/Checkout';
import { ComplementaryOrder, Order, createOrder } from './types/Order';
import { prodUrl } from './useFetchEvents';

export enum GetOrdersType {
  GET_ORDERS_FOR_USER = 'GET_ORDERS_FOR_USER',
  GET_ORDER_BY_ID = 'GET_ORDER_BY_ID',
  GET_ORDERS_FOR_EVENT = 'GET_ORDERS_FOR_EVENT',
}

export interface GetOrdersRequest {
  getOrdersType: keyof typeof GetOrdersType;
  id?: string;
  email?: string;
  jwtToken?: string;
}

export enum PostOrdersType {
  POST_ORDERS_CREATE_CHARGE = 'POST_ORDERS_CREATE_CHARGE',
  POST_ORDERS_CREATE_ORDER = 'POST_ORDERS_CREATE_ORDER',
  POST_ORDERS_CREATE_COMPLEMENTARY_ORDER = 'POST_ORDERS_CREATE_COMPLEMENTARY_ORDER',
}

export interface PostOrdersRequest {
  type: keyof typeof PostOrdersType;
  order?: Order;
  charge?: Charge;
  complementaryOrder?: ComplementaryOrder;
  jwtToken?: string;
}

export function useFetchOrderById({
  getOrdersType = GetOrdersType.GET_ORDER_BY_ID,
  id,
  jwtToken,
}: GetOrdersRequest) {
  const query = useQuery({
    queryKey: ['order', getOrdersType, id],
    queryFn: () => getOrders({ getOrdersType, id, jwtToken }),
  });

  return {
    ...query,
    showSignInError: !jwtToken,
  };
}
// fetch the events for the user logged in currently
export function useFetchUserOrders() {
  const { user } = useContext(TropTixContext);
  const getOrdersType = GetOrdersType.GET_ORDERS_FOR_USER;
  const email = user?.email;
  const jwtToken = user?.jwtToken;
  const query = useQuery({
    queryKey: ['order', getOrdersType, email],
    queryFn: () => getOrders({ getOrdersType, email, jwtToken }),
  });

  return {
    ...query,
    showSignInError: !user.id,
  };
}

// fetch the events for a specific event currently
export function useFetchEventOrders(eventId: string) {
  const { user } = useContext(TropTixContext);
  const getOrdersType = GetOrdersType.GET_ORDERS_FOR_EVENT;
  const id = eventId;
  const jwtToken = user.jwtToken;

  return useQuery({
    queryKey: ['order', getOrdersType, id],
    queryFn: () => getOrders({ getOrdersType, id, jwtToken }),
  });
}

export async function getOrders({
  getOrdersType,
  id,
  email,
  jwtToken,
}: GetOrdersRequest) {
  if (!jwtToken) {
    return {};
  }

  let url = prodUrl + `/api/orders?getOrdersType=${getOrdersType}`;

  if (getOrdersType === GetOrdersType.GET_ORDERS_FOR_USER) {
    url += `&email=${email}`;
  } else {
    url += `&id=${id}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
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

export function useCreateOrder() {
  return useMutation({
    mutationFn: async ({
      checkout,
      paymentId,
      customerId,
      userId,
      jwtToken,
    }: {
      checkout: Checkout;
      paymentId: string;
      customerId: string;
      userId: string;
      jwtToken: string;
    }) => {
      if (!paymentId) {
        message.error(
          'There was a problem with your request, please try again later'
        );
      }

      const order = createOrder(checkout, paymentId, customerId, userId);
      await postOrders({
        type: PostOrdersType.POST_ORDERS_CREATE_ORDER,
        order: order,
        jwtToken: jwtToken,
      });

      return order.id;
    },
  });
}

export function useCreateComplementaryOrder() {
  return useMutation({
    mutationFn: async (request: PostOrdersRequest) => {
      return await postOrders(request);
    },
  });
}

export async function postOrders({
  type,
  order,
  charge,
  complementaryOrder,
  jwtToken,
}: PostOrdersRequest) {
  try {
    let url = prodUrl + `/api/orders`;
    const request = { type, order, charge, complementaryOrder };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(request),
    });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${JSON.stringify(response)}`);
    // }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error('Error in postOrders:', error);
    throw error;
  }
}
