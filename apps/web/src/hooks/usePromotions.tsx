import { TropTixContext } from "@/components/WebNavigator";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from "react";
import { Promotion } from "./types/Promotion";
import { prodUrl } from './useFetchEvents';

export enum GetPromotionsType {
  GET_ALL_PROMOTIONS_FOR_EVENT = 'GET_ALL_PROMOTIONS_FOR_EVENT',
  GET_PROMOTIONS_BY_CODE = 'GET_PROMOTIONS_BY_CODE',
}

export interface GetPromotionsRequest {
  getPromotionsType: GetPromotionsType;
  eventId?: string;
  code?: string;
  jwtToken?: string;
}

export interface PostPromotionRequest {
  promotion?: Promotion;
  jwtToken?: string;
  editingPromotion?: boolean;
}

export interface DeletePromotionRequest {
  id?: string;
  jwtToken?: string;
}

export function useFetchPromotionsForEvent(eventId: string) {
  const { user } = useContext(TropTixContext);
  const getPromotionsType = GetPromotionsType.GET_ALL_PROMOTIONS_FOR_EVENT;
  const id = eventId;
  const jwtToken = user.jwtToken;

  return useQuery({
    queryKey: ['order', getPromotionsType, id],
    queryFn: () => getPromotions({ getPromotionsType, eventId, jwtToken }),
  });
}

export async function getPromotions({
  getPromotionsType,
  eventId,
  code,
  jwtToken,
}: GetPromotionsRequest) {
  if (!jwtToken) {
    return {};
  }

  let url =
    prodUrl + `/api/promotions?getPromotionsType=${getPromotionsType}`;

  switch (getPromotionsType) {
    case GetPromotionsType.GET_ALL_PROMOTIONS_FOR_EVENT:
      url += `&eventId=${eventId}`;
      break;
    case GetPromotionsType.GET_PROMOTIONS_BY_CODE:
      url += `&eventId=${eventId}&code=${code}`;
      break;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    const json = await response.json();

    return json;
  } catch (error) {
    console.error('Error in getting promotions:', error);
    throw error;
  }

}

export function usePostPromotion() {
  return useMutation({
    mutationFn: (request: PostPromotionRequest) =>
      mutatePromotion(request),
  });
}

export function useDeletePromotion() {
  return useMutation({
    mutationFn: (request: DeletePromotionRequest) =>
      deletePromotion(request),
  });
}

export async function mutatePromotion(
  request: PostPromotionRequest
): Promise<any> {
  const url = prodUrl + '/api/promotions';

  return await fetch(url, {
    method: request.editingPromotion ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${request.jwtToken}`,
    },
    body: JSON.stringify(request.promotion),
  })
    .then(async (response) => {
      const message = await response.json();
      if (!response.ok) {
        throw new Error(message.error);
      }

      return message;
    })
    .catch((error) => {
      throw error;
    });
}

export async function deletePromotion(
  request: DeletePromotionRequest
): Promise<any> {
  const url = prodUrl + `/api/promotions?id=${request.id}`;

  return await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${request.jwtToken}`,
    },
    body: JSON.stringify({ id: request.id }),
  })
    .then(async (response) => {
      const message = await response.json();
      if (!response.ok) {
        throw new Error(message.error);
      }

      return message;
    })
    .catch((error) => {
      throw error;
    });
}
