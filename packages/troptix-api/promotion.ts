import { prodUrl } from "./api";

export enum GetPromotionsType {
  GET_PROMOTIONS_ALL = 'GET_PROMOTIONS_ALL',
  GET_PROMOTIONS_BY_EVENT = 'GET_PROMOTIONS_BY_EVENT'
}

export interface GetPromotionsRequest {
  getPromotionsType: GetPromotionsType;
  eventId?: string;
  code?: string;
}

export async function addPromotion(promotion, isEditPromotion) {
  const url = prodUrl + '/api/promotions';

  const code = String(promotion.code).toUpperCase();
  const value = Number(promotion.value);
  promotion.code = code;
  promotion.value = value;

  const response = await fetch(url, {
    method: isEditPromotion ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promotion)
  });
  const json = await response.json();

  return json;
}

export async function getPromotions(request: GetPromotionsRequest) {
  let url = prodUrl + `/api/promotions?getPromotionsType=${request.getPromotionsType}`

  switch (request.getPromotionsType) {
    case GetPromotionsType.GET_PROMOTIONS_ALL:
      url += `&eventId=${request.eventId}`
      break;
    case GetPromotionsType.GET_PROMOTIONS_BY_EVENT:
      url += `&eventId=${request.eventId}&code=${request.code}`
      break;
  }
  const response = await fetch(url, {
    method: 'GET'
  });

  const json = await response.json();

  return json;
}