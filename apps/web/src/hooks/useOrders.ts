import { TropTixContext } from "@/components/WebNavigator";
import { useContext } from "react";
import { Charge } from "./types/Charge";
import { prodUrl } from "./useFetchEvents";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Checkout } from "./types/Checkout";
import { message } from "antd";
import { Order } from "troptix-models";

export enum GetOrdersType {
  GET_ORDERS_FOR_USER = "GET_ORDERS_FOR_USER",
  GET_ORDER_BY_ID = "GET_ORDER_BY_ID",
  GET_ORDERS_FOR_EVENT = "GET_ORDERS_FOR_EVENT",
}

export interface GetOrdersRequest {
  getOrdersType: keyof typeof GetOrdersType;
  id: string;
}

export enum PostOrdersType {
  POST_ORDERS_CREATE_CHARGE = "POST_ORDERS_CREATE_CHARGE",
  POST_ORDERS_CREATE_ORDER = "POST_ORDERS_CREATE_ORDER",
}

export interface PostOrdersRequest {
  type: keyof typeof PostOrdersType;
  order?: Order;
  charge?: Charge;
}

export function useFetchOrderById({
  getOrdersType = GetOrdersType.GET_ORDER_BY_ID,
  id,
}: GetOrdersRequest) {
  return useQuery({
    queryKey: ["order", getOrdersType, id],
    queryFn: () => getOrders({ getOrdersType, id }),
  });
}
// fetch the events for the user logged in currently
export function useFetchUserOrders() {
  const { user } = useContext(TropTixContext);
  return useFetchOrderById({
    getOrdersType: GetOrdersType.GET_ORDERS_FOR_USER,
    id: user.id,
  });
}

// fetch the events for a specific event currently
export function useFetchEventOrders(eventId: string) {
  return useFetchOrderById({
    getOrdersType: GetOrdersType.GET_ORDERS_FOR_EVENT,
    id: eventId,
  });
}

export async function getOrders({ getOrdersType, id }: GetOrdersRequest) {
  try {
    if (!id) {
      throw new Error("user id not defined");
    }
    let url = prodUrl + `/api/orders?getOrdersType=${getOrdersType}&id=${id}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });
    const json = await response.json();

    return json;
  } catch (error) {
    console.error("Error in getOrders:", error);
    throw error;
  }
}

export function useFetchPaymentSheet() {
  return useMutation({
    mutationFn: postCharge,
  });
}

async function postCharge({
  checkout,
  userId,
}: {
  checkout: Checkout;
  userId: string;
}) {
  return await postOrders({
    type: PostOrdersType.POST_ORDERS_CREATE_CHARGE,
    charge: createCharge(checkout, userId),
  });
}

export function useCreatePaymentSheet() {
  return useMutation({
    mutationFn: async ({
      checkout,
      userId,
      eventId,
    }: {
      checkout: Checkout;
      userId: string;
      eventId: string;
    }) => {
      const chargeMutation = useFetchPaymentSheet();
      const { paymentId, clientSecret, customerId } =
        await chargeMutation.mutateAsync({
          checkout,
          userId,
        });
      if (!paymentId) {
        message.error(
          "There was a problem with your request, please try again later"
        );
      }

      postOrders({
        type: PostOrdersType.POST_ORDERS_CREATE_ORDER,
        order: new Order(checkout, paymentId, eventId, userId, customerId),
      });
      return { paymentId, clientSecret };
    },
  });
}

function createCharge(checkout: Checkout, userId: string): Charge {
  const total = checkout.promotionApplied
    ? checkout.discountedTotal * 100
    : checkout.total * 100;
  const charge: Charge = { total, userId };
  return charge;
}

export async function postOrders({ type, order, charge }: PostOrdersRequest) {
  try {
    let url = prodUrl + `/api/orders`;
    const request = { type, order, charge };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    const json = await response.json();

    return json;
  } catch (error) {
    console.error("Error in postOrders:", error);
    throw error;
  }
}
